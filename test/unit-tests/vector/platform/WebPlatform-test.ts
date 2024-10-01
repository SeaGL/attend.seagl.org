/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

import fetchMock from "fetch-mock-jest";
import { UpdateCheckStatus } from "matrix-react-sdk/src/BasePlatform";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";

import WebPlatform from "../../../../src/vector/platform/WebPlatform";
import { setupLanguageMock } from "../../../setup/setupLanguage";

fetchMock.config.overwriteRoutes = true;

describe("WebPlatform", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupLanguageMock();
    });

    it("returns human readable name", () => {
        const platform = new WebPlatform();
        expect(platform.getHumanReadableName()).toEqual("Web Platform");
    });

    it("registers service worker", () => {
        // @ts-ignore - mocking readonly object
        navigator.serviceWorker = { register: jest.fn() };
        new WebPlatform();
        expect(navigator.serviceWorker.register).toHaveBeenCalled();
    });

    it("should call reload on window location object", () => {
        Object.defineProperty(window, "location", { value: { reload: jest.fn() }, writable: true });

        const platform = new WebPlatform();
        expect(window.location.reload).not.toHaveBeenCalled();
        platform.reload();
        expect(window.location.reload).toHaveBeenCalled();
    });

    it("should call reload to install update", () => {
        Object.defineProperty(window, "location", { value: { reload: jest.fn() }, writable: true });

        const platform = new WebPlatform();
        expect(window.location.reload).not.toHaveBeenCalled();
        platform.installUpdate();
        expect(window.location.reload).toHaveBeenCalled();
    });

    describe("getDefaultDeviceDisplayName", () => {
        it.each([
            [
                "https://develop.element.io/#/room/!foo:bar",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) " +
                    "Chrome/105.0.0.0 Safari/537.36",
                "develop.element.io: Chrome on macOS",
            ],
        ])("%s & %s = %s", (url, userAgent, result) => {
            Object.defineProperty(window, "navigator", { value: { userAgent }, writable: true });
            Object.defineProperty(window, "location", { value: { href: url }, writable: true });
            const platform = new WebPlatform();
            expect(platform.getDefaultDeviceDisplayName()).toEqual(result);
        });
    });

    describe("notification support", () => {
        const mockNotification = {
            requestPermission: jest.fn(),
            permission: "notGranted",
        };
        beforeEach(() => {
            // @ts-ignore
            window.Notification = mockNotification;
            mockNotification.permission = "notGranted";
        });

        it("supportsNotifications returns false when platform does not support notifications", () => {
            // @ts-ignore
            window.Notification = undefined;
            expect(new WebPlatform().supportsNotifications()).toBe(false);
        });

        it("supportsNotifications returns true when platform supports notifications", () => {
            expect(new WebPlatform().supportsNotifications()).toBe(true);
        });

        it("maySendNotifications returns true when notification permissions are not granted", () => {
            expect(new WebPlatform().maySendNotifications()).toBe(false);
        });

        it("maySendNotifications returns true when notification permissions are granted", () => {
            mockNotification.permission = "granted";
            expect(new WebPlatform().maySendNotifications()).toBe(true);
        });

        it("requests notification permissions and returns result ", async () => {
            mockNotification.requestPermission.mockImplementation((callback) => callback("test"));

            const platform = new WebPlatform();
            const result = await platform.requestNotificationPermission();
            expect(result).toEqual("test");
        });
    });

    describe("app version", () => {
        const envVersion = process.env.VERSION;
        const prodVersion = "1.10.13";

        beforeEach(() => {
            jest.spyOn(MatrixClientPeg, "userRegisteredWithinLastHours").mockReturnValue(false);
        });

        afterAll(() => {
            // @ts-ignore
            WebPlatform.VERSION = envVersion;
        });

        it("should return true from canSelfUpdate()", async () => {
            const platform = new WebPlatform();
            const result = await platform.canSelfUpdate();
            expect(result).toBe(true);
        });

        it("getAppVersion returns normalized app version", async () => {
            // @ts-ignore
            WebPlatform.VERSION = prodVersion;
            const platform = new WebPlatform();

            const version = await platform.getAppVersion();
            expect(version).toEqual(prodVersion);

            // @ts-ignore
            WebPlatform.VERSION = `v${prodVersion}`;
            const version2 = await platform.getAppVersion();
            // v prefix removed
            expect(version2).toEqual(prodVersion);

            // @ts-ignore
            WebPlatform.VERSION = `version not like semver`;
            const notSemverVersion = await platform.getAppVersion();
            expect(notSemverVersion).toEqual(`version not like semver`);
        });

        describe("pollForUpdate()", () => {
            it(
                "should return not available and call showNoUpdate when current version " +
                    "matches most recent version",
                async () => {
                    // @ts-ignore
                    WebPlatform.VERSION = prodVersion;
                    fetchMock.getOnce("/version", prodVersion);
                    const platform = new WebPlatform();

                    const showUpdate = jest.fn();
                    const showNoUpdate = jest.fn();
                    const result = await platform.pollForUpdate(showUpdate, showNoUpdate);

                    expect(result).toEqual({ status: UpdateCheckStatus.NotAvailable });
                    expect(showUpdate).not.toHaveBeenCalled();
                    expect(showNoUpdate).toHaveBeenCalled();
                },
            );

            it("should strip v prefix from versions before comparing", async () => {
                // @ts-ignore
                WebPlatform.VERSION = prodVersion;
                fetchMock.getOnce("/version", `v${prodVersion}`);
                const platform = new WebPlatform();

                const showUpdate = jest.fn();
                const showNoUpdate = jest.fn();
                const result = await platform.pollForUpdate(showUpdate, showNoUpdate);

                // versions only differ by v prefix, no update
                expect(result).toEqual({ status: UpdateCheckStatus.NotAvailable });
                expect(showUpdate).not.toHaveBeenCalled();
                expect(showNoUpdate).toHaveBeenCalled();
            });

            it(
                "should return ready and call showUpdate when current version " + "differs from most recent version",
                async () => {
                    // @ts-ignore
                    WebPlatform.VERSION = "0.0.0"; // old version
                    fetchMock.getOnce("/version", prodVersion);
                    const platform = new WebPlatform();

                    const showUpdate = jest.fn();
                    const showNoUpdate = jest.fn();
                    const result = await platform.pollForUpdate(showUpdate, showNoUpdate);

                    expect(result).toEqual({ status: UpdateCheckStatus.Ready });
                    expect(showUpdate).toHaveBeenCalledWith("0.0.0", prodVersion);
                    expect(showNoUpdate).not.toHaveBeenCalled();
                },
            );

            it("should return ready without showing update when user registered in last 24", async () => {
                // @ts-ignore
                WebPlatform.VERSION = "0.0.0"; // old version
                jest.spyOn(MatrixClientPeg, "userRegisteredWithinLastHours").mockReturnValue(true);
                fetchMock.getOnce("/version", prodVersion);
                const platform = new WebPlatform();

                const showUpdate = jest.fn();
                const showNoUpdate = jest.fn();
                const result = await platform.pollForUpdate(showUpdate, showNoUpdate);

                expect(result).toEqual({ status: UpdateCheckStatus.Ready });
                expect(showUpdate).not.toHaveBeenCalled();
                expect(showNoUpdate).not.toHaveBeenCalled();
            });

            it("should return error when version check fails", async () => {
                fetchMock.getOnce("/version", { throws: "oups" });
                const platform = new WebPlatform();

                const showUpdate = jest.fn();
                const showNoUpdate = jest.fn();
                const result = await platform.pollForUpdate(showUpdate, showNoUpdate);

                expect(result).toEqual({ status: UpdateCheckStatus.Error, detail: "Unknown Error" });
                expect(showUpdate).not.toHaveBeenCalled();
                expect(showNoUpdate).not.toHaveBeenCalled();
            });
        });
    });
});
