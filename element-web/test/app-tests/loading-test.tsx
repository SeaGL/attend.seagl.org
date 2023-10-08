/*
Copyright 2016 OpenMarket Ltd
Copyright 2020 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* loading.js: test the myriad paths we have for loading the application */

import "fake-indexeddb/auto";
import React from "react";
import { render, screen, fireEvent, waitFor, RenderResult, waitForElementToBeRemoved } from "@testing-library/react";
import PlatformPeg from "matrix-react-sdk/src/PlatformPeg";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import MatrixChat from "matrix-react-sdk/src/components/structures/MatrixChat";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import MockHttpBackend from "matrix-mock-request";
import { ValidatedServerConfig } from "matrix-react-sdk/src/utils/ValidatedServerConfig";
import { IndexedDBCryptoStore } from "matrix-js-sdk/src/crypto/store/indexeddb-crypto-store";
import { QueryDict, sleep } from "matrix-js-sdk/src/utils";
import { IConfigOptions } from "matrix-react-sdk/src/IConfigOptions";
import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";

import "../jest-mocks";
import WebPlatform from "../../src/vector/platform/WebPlatform";
import { parseQs, parseQsFromFragment } from "../../src/vector/url_utils";
import { cleanLocalstorage, deleteIndexedDB, waitForLoadingSpinner, waitForWelcomeComponent } from "../test-utils";

const DEFAULT_HS_URL = "http://my_server";
const DEFAULT_IS_URL = "http://my_is";

describe("loading:", function () {
    let httpBackend: MockHttpBackend;

    // an Object simulating the window.location
    let windowLocation: Location | undefined;

    // the mounted MatrixChat
    let matrixChat: RenderResult | undefined;

    // a promise which resolves when the MatrixChat calls onTokenLoginCompleted
    let tokenLoginCompletePromise: Promise<void> | undefined;

    beforeEach(function () {
        httpBackend = new MockHttpBackend();
        // @ts-ignore
        window.fetch = httpBackend.fetchFn;

        windowLocation = undefined;
        matrixChat = undefined;
    });

    afterEach(async function () {
        console.log(`${Date.now()}: loading: afterEach`);
        matrixChat?.unmount();
        // unmounting should have cleared the MatrixClientPeg
        expect(MatrixClientPeg.get()).toBe(null);

        // clear the indexeddbs so we can start from a clean slate next time.
        await Promise.all([deleteIndexedDB("matrix-js-sdk:crypto"), deleteIndexedDB("matrix-js-sdk:riot-web-sync")]);
        cleanLocalstorage();
        console.log(`${Date.now()}: loading: afterEach complete`);
    });

    /* simulate the load process done by index.js
     *
     * TODO: it would be nice to factor some of this stuff out of index.js so
     * that we can test it rather than our own implementation of it.
     */
    function loadApp(
        opts: {
            queryString?: string;
            uriFragment?: string;
            config?: IConfigOptions;
        } = {},
    ): void {
        const queryString = opts.queryString || "";
        const uriFragment = opts.uriFragment || "";

        windowLocation = {
            search: queryString,
            hash: uriFragment,
            toString: function (): string {
                return this.search + this.hash;
            },
        } as Location;

        function onNewScreen(screen: string): void {
            console.log(Date.now() + " newscreen " + screen);
            const hash = "#/" + screen;
            windowLocation!.hash = hash;
            console.log(Date.now() + " browser URI now " + windowLocation);
        }

        // Parse the given window.location and return parameters that can be used when calling
        // MatrixChat.showScreen(screen, params)
        function getScreenFromLocation(location: Location): { screen: string; params: QueryDict } {
            const fragparts = parseQsFromFragment(location);
            return {
                screen: fragparts.location.substring(1),
                params: fragparts.params,
            };
        }

        const fragParts = parseQsFromFragment(windowLocation);

        const config = {
            default_hs_url: DEFAULT_HS_URL,
            default_is_url: DEFAULT_IS_URL,
            validated_server_config: {
                hsUrl: DEFAULT_HS_URL,
                hsName: "TEST_ENVIRONMENT",
                hsNameIsDifferent: false, // yes, we lie
                isUrl: DEFAULT_IS_URL,
            } as ValidatedServerConfig,
            embedded_pages: {
                home_url: "data:text/html;charset=utf-8;base64,PGh0bWw+PC9odG1sPg==",
            },
            ...(opts.config ?? {}),
        } as IConfigOptions;

        PlatformPeg.set(new WebPlatform());

        const params = parseQs(windowLocation);

        tokenLoginCompletePromise = new Promise<void>((resolve) => {
            matrixChat = render(
                <MatrixChat
                    onNewScreen={onNewScreen}
                    config={config!}
                    realQueryParams={params}
                    startingFragmentQueryParams={fragParts.params}
                    enableGuest={true}
                    onTokenLoginCompleted={resolve}
                    initialScreenAfterLogin={getScreenFromLocation(windowLocation!)}
                />,
            );
        });
    }

    // set an expectation that we will get a call to /sync, then flush
    // http requests until we do.
    //
    // returns a promise resolving to the received request
    async function expectAndAwaitSync(opts?: { isGuest?: boolean }): Promise<any> {
        let syncRequest: (typeof MockHttpBackend.prototype.requests)[number] | null = null;
        httpBackend.when("GET", "/_matrix/client/versions").respond(200, {
            versions: ["v1.1"],
            unstable_features: {},
        });
        const isGuest = opts?.isGuest;
        if (!isGuest) {
            // the call to create the LL filter
            httpBackend.when("POST", "/filter").respond(200, { filter_id: "llfid" });
            httpBackend.when("GET", "/pushrules").respond(200, {});
        }
        httpBackend
            .when("GET", "/sync")
            .check((r) => {
                syncRequest = r;
            })
            .respond(200, {});

        for (let attempts = 10; attempts > 0; attempts--) {
            console.log(Date.now() + " waiting for /sync");
            if (syncRequest) {
                return syncRequest;
            }
            await httpBackend.flush(undefined);
        }
        throw new Error("Gave up waiting for /sync");
    }

    describe("Clean load with no stored credentials:", function () {
        it("gives a welcome page by default", function () {
            loadApp();

            return sleep(1)
                .then(async () => {
                    // at this point, we're trying to do a guest registration;
                    // we expect a spinner
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/register")
                        .check(function (req) {
                            expect(req.queryParams?.kind).toEqual("guest");
                        })
                        .respond(403, "Guest access is disabled");

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    // Wait for another trip around the event loop for the UI to update
                    return waitForWelcomeComponent(matrixChat);
                })
                .then(() => {
                    return waitFor(() => expect(windowLocation?.hash).toEqual("#/welcome"));
                });
        });

        it("should follow the original link after successful login", function () {
            loadApp({
                uriFragment: "#/room/!room:id",
            });

            // Pass the liveliness checks
            httpBackend.when("GET", "/versions").respond(200, { versions: ["v1.1"] });
            httpBackend.when("GET", "/_matrix/identity/v2").respond(200, {});

            return sleep(1)
                .then(async () => {
                    // at this point, we're trying to do a guest registration;
                    // we expect a spinner
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/register")
                        .check(function (req) {
                            expect(req.queryParams?.kind).toEqual("guest");
                        })
                        .respond(403, "Guest access is disabled");

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    // Wait for another trip around the event loop for the UI to update
                    return sleep(10);
                })
                .then(() => {
                    return moveFromWelcomeToLogin(matrixChat);
                })
                .then(() => {
                    return completeLogin(matrixChat!);
                })
                .then(() => {
                    // once the sync completes, we should have a room view
                    return awaitRoomView(matrixChat);
                })
                .then(() => {
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(windowLocation?.hash).toEqual("#/room/!room:id");

                    // and the localstorage should have been updated
                    expect(localStorage.getItem("mx_user_id")).toEqual("@user:id");
                    expect(localStorage.getItem("mx_access_token")).toEqual("access_token");
                    expect(localStorage.getItem("mx_hs_url")).toEqual(DEFAULT_HS_URL);
                    expect(localStorage.getItem("mx_is_url")).toEqual(DEFAULT_IS_URL);
                });
        });

        it.skip("should not register as a guest when using a #/login link", function () {
            loadApp({
                uriFragment: "#/login",
            });

            // Pass the liveliness checks
            httpBackend.when("GET", "/versions").respond(200, { versions: ["v1.1"] });
            httpBackend.when("GET", "/_matrix/identity/v2").respond(200, {});

            return awaitLoginComponent(matrixChat)
                .then(async () => {
                    await waitForElementToBeRemoved(() => screen.queryAllByLabelText("Loading..."));
                    // we expect a single <Login> component
                    await screen.findByRole("main");
                    screen.getAllByText("Sign in");

                    // the only outstanding request should be a GET /login
                    // (in particular there should be no /register request for
                    // guest registration).
                    const allowedRequests = ["/_matrix/client/v3/login", "/versions", "/_matrix/identity/v2"];
                    for (const req of httpBackend.requests) {
                        if (req.method === "GET" && allowedRequests.find((p) => req.path.endsWith(p))) {
                            continue;
                        }

                        throw new Error(`Unexpected HTTP request to ${req}`);
                    }
                    return completeLogin(matrixChat!);
                })
                .then(() => {
                    expect(matrixChat?.container.querySelector(".mx_HomePage")).toBeTruthy();
                    expect(windowLocation?.hash).toEqual("#/home");
                });
        });
    });

    describe("MatrixClient rehydrated from stored credentials:", function () {
        beforeEach(async function () {
            localStorage.setItem("mx_hs_url", "http://localhost");
            localStorage.setItem("mx_is_url", "http://localhost");
            localStorage.setItem("mx_access_token", "access_token");
            localStorage.setItem("mx_user_id", "@me:localhost");
            localStorage.setItem("mx_last_room_id", "!last_room:id");

            // Create a crypto store as well to satisfy storage consistency checks
            const cryptoStore = new IndexedDBCryptoStore(indexedDB, "matrix-js-sdk:crypto");
            await cryptoStore.startup();
        });

        it("shows the last known room by default", function () {
            loadApp();

            return awaitLoggedIn(matrixChat!)
                .then(() => {
                    // we are logged in - let the sync complete
                    return expectAndAwaitSync();
                })
                .then(() => {
                    // once the sync completes, we should have a room view
                    return awaitRoomView(matrixChat);
                })
                .then(() => {
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(windowLocation?.hash).toEqual("#/room/!last_room:id");
                });
        });

        it("shows a home page by default if we have no joined rooms", function () {
            localStorage.removeItem("mx_last_room_id");

            loadApp();

            return awaitLoggedIn(matrixChat!)
                .then(() => {
                    // we are logged in - let the sync complete
                    return expectAndAwaitSync();
                })
                .then(() => {
                    // once the sync completes, we should have a home page
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(matrixChat?.container.querySelector(".mx_HomePage")).toBeTruthy();
                    expect(windowLocation?.hash).toEqual("#/home");
                });
        });

        it("shows a room view if we followed a room link", function () {
            loadApp({
                uriFragment: "#/room/!room:id",
            });

            return awaitLoggedIn(matrixChat!)
                .then(() => {
                    // we are logged in - let the sync complete
                    return expectAndAwaitSync();
                })
                .then(() => {
                    // once the sync completes, we should have a room view
                    return awaitRoomView(matrixChat);
                })
                .then(() => {
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(windowLocation?.hash).toEqual("#/room/!room:id");
                });
        });

        describe("/#/login link:", function () {
            beforeEach(function () {
                loadApp({
                    uriFragment: "#/login",
                });

                // give the UI a chance to display
                return expectAndAwaitSync();
            });

            it("does not show a login view", async function () {
                await awaitRoomView(matrixChat);

                await screen.findByLabelText("Spaces");
                expect(screen.queryAllByText("Sign in")).toHaveLength(0);
            });
        });
    });

    describe("Guest auto-registration:", function () {
        it("shows a welcome page by default", function () {
            loadApp();

            return sleep(1)
                .then(async () => {
                    // at this point, we're trying to do a guest registration;
                    // we expect a spinner
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/register")
                        .check(function (req) {
                            expect(req.queryParams?.kind).toEqual("guest");
                        })
                        .respond(200, {
                            user_id: "@guest:localhost",
                            access_token: "secret_token",
                        });

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    return awaitLoggedIn(matrixChat!);
                })
                .then(() => {
                    // we are logged in - let the sync complete
                    return expectAndAwaitSync({ isGuest: true });
                })
                .then(() => {
                    // once the sync completes, we should have a welcome page
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(matrixChat?.container.querySelector(".mx_Welcome")).toBeTruthy();
                    expect(windowLocation?.hash).toEqual("#/welcome");
                });
        });

        it("uses the default homeserver to register with", function () {
            loadApp();

            return sleep(1)
                .then(async () => {
                    // at this point, we're trying to do a guest registration;
                    // we expect a spinner
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/register")
                        .check(function (req) {
                            expect(req.path.startsWith(DEFAULT_HS_URL)).toBe(true);
                            expect(req.queryParams?.kind).toEqual("guest");
                        })
                        .respond(200, {
                            user_id: "@guest:localhost",
                            access_token: "secret_token",
                        });

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    return awaitLoggedIn(matrixChat!);
                })
                .then(() => {
                    return expectAndAwaitSync({ isGuest: true });
                })
                .then((req) => {
                    expect(req.path.startsWith(DEFAULT_HS_URL)).toBe(true);

                    // once the sync completes, we should have a welcome page
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(matrixChat?.container.querySelector(".mx_Welcome")).toBeTruthy();
                    expect(windowLocation?.hash).toEqual("#/welcome");
                    expect(MatrixClientPeg.safeGet().baseUrl).toEqual(DEFAULT_HS_URL);
                    expect(MatrixClientPeg.safeGet().idBaseUrl).toEqual(DEFAULT_IS_URL);
                });
        });

        it("shows a room view if we followed a room link", function () {
            loadApp({
                uriFragment: "#/room/!room:id",
            });
            return sleep(1)
                .then(async () => {
                    // at this point, we're trying to do a guest registration;
                    // we expect a spinner
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/register")
                        .check(function (req) {
                            expect(req.queryParams?.kind).toEqual("guest");
                        })
                        .respond(200, {
                            user_id: "@guest:localhost",
                            access_token: "secret_token",
                        });

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    return awaitLoggedIn(matrixChat!);
                })
                .then(() => {
                    return expectAndAwaitSync({ isGuest: true });
                })
                .then(() => {
                    // once the sync completes, we should have a room view
                    return awaitRoomView(matrixChat);
                })
                .then(() => {
                    httpBackend.verifyNoOutstandingExpectation();
                    expect(windowLocation?.hash).toEqual("#/room/!room:id");
                });
        });

        describe("Login as user", function () {
            beforeEach(function () {
                // first we have to load the homepage
                loadApp();

                httpBackend
                    .when("POST", "/register")
                    .check(function (req) {
                        expect(req.queryParams?.kind).toEqual("guest");
                    })
                    .respond(200, {
                        user_id: "@guest:localhost",
                        access_token: "secret_token",
                    });

                return httpBackend
                    .flush(undefined)
                    .then(() => {
                        return awaitLoggedIn(matrixChat!);
                    })
                    .then(() => {
                        // we got a sync spinner - let the sync complete
                        return expectAndAwaitSync();
                    })
                    .then(async () => {
                        // once the sync completes, we should have a home page
                        await waitFor(() => matrixChat?.container.querySelector(".mx_HomePage"));

                        // we simulate a click on the 'login' button by firing off
                        // the relevant dispatch.
                        //
                        // XXX: is it an anti-pattern to access the react-sdk's
                        // dispatcher in this way? Is it better to find the login
                        // button and simulate a click? (we might have to arrange
                        // for it to be shown - it's not always, due to the
                        // collapsing left panel

                        dis.dispatch({ action: "start_login" });

                        return awaitLoginComponent(matrixChat);
                    });
            });

            it("should give us a login page", async function () {
                // we expect a single <Login> component
                await screen.findByRole("main");
                screen.getAllByText("Sign in");

                expect(windowLocation?.hash).toEqual("#/login");
            });
        });
    });

    describe("Token login:", function () {
        it("logs in successfully", function () {
            localStorage.setItem("mx_sso_hs_url", "https://homeserver");
            localStorage.setItem("mx_sso_is_url", "https://idserver");
            loadApp({
                queryString: "?loginToken=secretToken",
            });

            return sleep(1)
                .then(async () => {
                    // we expect a spinner while we're logging in
                    await waitForLoadingSpinner();

                    httpBackend
                        .when("POST", "/login")
                        .check(function (req) {
                            expect(req.path).toMatch(new RegExp("^https://homeserver/"));
                            expect(req.data.type).toEqual("m.login.token");
                            expect(req.data.token).toEqual("secretToken");
                        })
                        .respond(200, {
                            user_id: "@user:localhost",
                            device_id: "DEVICE_ID",
                            access_token: "access_token",
                        });

                    return httpBackend.flush(undefined);
                })
                .then(() => {
                    // at this point, MatrixChat should fire onTokenLoginCompleted, which
                    // makes index.js reload the app. We're not going to attempt to
                    // simulate the reload - just check that things are left in the
                    // right state for the reloaded app.

                    return tokenLoginCompletePromise;
                })
                .then(() => {
                    return expectAndAwaitSync().catch((e) => {
                        throw new Error("Never got /sync after login: did the client start?");
                    });
                })
                .then(() => {
                    // check that the localstorage has been set up in such a way that
                    // the reloaded app can pick up where we leave off.
                    expect(localStorage.getItem("mx_user_id")).toEqual("@user:localhost");
                    expect(localStorage.getItem("mx_access_token")).toEqual("access_token");
                    expect(localStorage.getItem("mx_hs_url")).toEqual("https://homeserver");
                    expect(localStorage.getItem("mx_is_url")).toEqual("https://idserver");
                });
        });
    });

    // check that we have a Login component, send a 'user:pass' login,
    // and await the HTTP requests.
    async function completeLogin(matrixChat: RenderResult): Promise<void> {
        // When we switch to the login component, it'll hit the login endpoint
        // for proof of life and to get flows. We'll only give it one option.
        httpBackend.when("GET", "/login").respond(200, { flows: [{ type: "m.login.password" }] });
        httpBackend.flush(undefined); // We already would have tried the GET /login request

        httpBackend
            .when("POST", "/login")
            .check(function (req) {
                expect(req.data.type).toEqual("m.login.password");
                expect(req.data.identifier.type).toEqual("m.id.user");
                expect(req.data.identifier.user).toEqual("user");
                expect(req.data.password).toEqual("pass");
            })
            .respond(200, {
                user_id: "@user:id",
                device_id: "DEVICE_ID",
                access_token: "access_token",
            });

        // Give the component some time to finish processing the login flows before continuing.
        await waitFor(() => expect(matrixChat?.container.querySelector("#mx_LoginForm_username")).toBeTruthy());

        // Enter login details
        fireEvent.change(matrixChat.container.querySelector("#mx_LoginForm_username")!, { target: { value: "user" } });
        fireEvent.change(matrixChat.container.querySelector("#mx_LoginForm_password")!, { target: { value: "pass" } });
        fireEvent.click(screen.getByText("Sign in", { selector: ".mx_Login_submit" }));

        return httpBackend
            .flush(undefined)
            .then(() => {
                // Wait for another trip around the event loop for the UI to update
                return sleep(1);
            })
            .then(() => {
                return expectAndAwaitSync().catch((e) => {
                    throw new Error("Never got /sync after login: did the client start?");
                });
            })
            .then(() => {
                httpBackend.verifyNoOutstandingExpectation();
            });
    }
});

async function awaitLoggedIn(matrixChat: RenderResult): Promise<void> {
    if (matrixChat.container.querySelector(".mx_MatrixChat_wrapper")) return; // already logged in

    return new Promise((resolve) => {
        const onAction = ({ action }: ActionPayload): void => {
            if (action !== "on_logged_in") {
                return;
            }
            console.log(Date.now() + ": Received on_logged_in action");
            dis.unregister(dispatcherRef);
            resolve(sleep(1));
        };
        const dispatcherRef = dis.register(onAction);
        console.log(Date.now() + ": Waiting for on_logged_in action");
    });
}

async function awaitRoomView(matrixChat?: RenderResult): Promise<void> {
    await waitFor(() => matrixChat?.container.querySelector(".mx_RoomView"));
}

async function awaitLoginComponent(matrixChat?: RenderResult): Promise<void> {
    await waitFor(() => matrixChat?.container.querySelector(".mx_AuthPage"));
}

function moveFromWelcomeToLogin(matrixChat?: RenderResult): Promise<void> {
    dis.dispatch({ action: "start_login" });
    return awaitLoginComponent(matrixChat);
}
