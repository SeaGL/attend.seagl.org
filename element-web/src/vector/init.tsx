/*
Copyright 2015, 2016 OpenMarket Ltd
Copyright 2017 Vector Creations Ltd
Copyright 2019 Michael Telatynski <7t3chguy@gmail.com>
Copyright 2018 - 2022 New Vector Ltd

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

import * as ReactDOM from "react-dom";
import * as React from "react";
import * as languageHandler from "matrix-react-sdk/src/languageHandler";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import PlatformPeg from "matrix-react-sdk/src/PlatformPeg";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import { setTheme } from "matrix-react-sdk/src/theme";
import { logger } from "matrix-js-sdk/src/logger";
import { ModuleRunner } from "matrix-react-sdk/src/modules/ModuleRunner";
import MatrixChat from "matrix-react-sdk/src/components/structures/MatrixChat";

import ElectronPlatform from "./platform/ElectronPlatform";
import PWAPlatform from "./platform/PWAPlatform";
import WebPlatform from "./platform/WebPlatform";
import { initRageshake, initRageshakeStore } from "./rageshakesetup";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - this path is created at runtime and therefore won't exist at typecheck time
import { INSTALLED_MODULES } from "../modules";

export const rageshakePromise = initRageshake();

export function preparePlatform(): void {
    if (window.electron) {
        logger.log("Using Electron platform");
        PlatformPeg.set(new ElectronPlatform());
    } else if (window.matchMedia("(display-mode: standalone)").matches) {
        logger.log("Using PWA platform");
        PlatformPeg.set(new PWAPlatform());
    } else {
        logger.log("Using Web platform");
        PlatformPeg.set(new WebPlatform());
    }
}

export function setupLogStorage(): Promise<void> {
    if (SdkConfig.get().bug_report_endpoint_url) {
        return initRageshakeStore();
    }
    logger.warn("No bug report endpoint set - logs will not be persisted");
    return Promise.resolve();
}

export async function loadConfig(): Promise<void> {
    // XXX: We call this twice, once here and once in MatrixChat as a prop. We call it here to ensure
    // granular settings are loaded correctly and to avoid duplicating the override logic for the theme.
    //
    // Note: this isn't called twice for some wrappers, like the Jitsi wrapper.
    const platformConfig = await PlatformPeg.get()?.getConfig();
    if (platformConfig) {
        SdkConfig.put(platformConfig);
    } else {
        SdkConfig.reset();
    }
}

export async function loadLanguage(): Promise<void> {
    const prefLang = SettingsStore.getValue("language", null, /*excludeDefault=*/ true);
    let langs: string[] = [];

    if (!prefLang) {
        languageHandler.getLanguagesFromBrowser().forEach((l) => {
            langs.push(...languageHandler.getNormalizedLanguageKeys(l));
        });
    } else {
        langs = [prefLang];
    }
    try {
        await languageHandler.setLanguage(langs);
        document.documentElement.setAttribute("lang", languageHandler.getCurrentLanguage());
    } catch (e) {
        logger.error("Unable to set language", e);
    }
}

export async function loadTheme(): Promise<void> {
    return setTheme();
}

export async function loadApp(fragParams: {}): Promise<void> {
    // load app.js async so that its code is not executed immediately and we can catch any exceptions
    const module = await import(
        /* webpackChunkName: "element-web-app" */
        /* webpackPreload: true */
        "./app"
    );
    function setWindowMatrixChat(matrixChat: MatrixChat): void {
        window.matrixChat = matrixChat;
    }
    ReactDOM.render(await module.loadApp(fragParams, setWindowMatrixChat), document.getElementById("matrixchat"));
}

export async function showError(title: string, messages?: string[]): Promise<void> {
    const { ErrorView } = await import(
        /* webpackChunkName: "error-view" */
        "../async-components/structures/ErrorView"
    );
    window.matrixChat = ReactDOM.render(
        <ErrorView title={title} messages={messages} />,
        document.getElementById("matrixchat"),
    );
}

export async function showIncompatibleBrowser(onAccept: () => void): Promise<void> {
    const { UnsupportedBrowserView } = await import(
        /* webpackChunkName: "error-view" */
        "../async-components/structures/ErrorView"
    );
    window.matrixChat = ReactDOM.render(
        <UnsupportedBrowserView onAccept={onAccept} />,
        document.getElementById("matrixchat"),
    );
}

export async function loadModules(): Promise<void> {
    for (const InstalledModule of INSTALLED_MODULES) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - we know the constructor exists even if TypeScript can't be convinced of that
        ModuleRunner.instance.registerModule((api) => new InstalledModule(api));
    }
}

export { _t } from "../languageHandler";

export { extractErrorMessageFromError } from "matrix-react-sdk/src/components/views/dialogs/ErrorDialog";
