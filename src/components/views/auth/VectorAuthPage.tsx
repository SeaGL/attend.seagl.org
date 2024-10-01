/*
Copyright 2019, 2020 New Vector Ltd

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

import * as React from "react";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";

import VectorAuthFooter from "./VectorAuthFooter";

export default class VectorAuthPage extends React.PureComponent {
    private static welcomeBackgroundUrl?: string;

    // cache the url as a static to prevent it changing without refreshing
    private static getWelcomeBackgroundUrl(): string {
        if (VectorAuthPage.welcomeBackgroundUrl) return VectorAuthPage.welcomeBackgroundUrl;

        const brandingConfig = SdkConfig.getObject("branding");
        VectorAuthPage.welcomeBackgroundUrl = "themes/element/img/backgrounds/lake.jpg";

        const configuredUrl = brandingConfig?.get("welcome_background_url");
        if (configuredUrl) {
            if (Array.isArray(configuredUrl)) {
                const index = Math.floor(Math.random() * configuredUrl.length);
                VectorAuthPage.welcomeBackgroundUrl = configuredUrl[index];
            } else {
                VectorAuthPage.welcomeBackgroundUrl = configuredUrl;
            }
        }

        return VectorAuthPage.welcomeBackgroundUrl;
    }

    public render(): React.ReactElement {
        const pageStyle = {
            background: `center/cover fixed url(${VectorAuthPage.getWelcomeBackgroundUrl()})`,
        };

        const modalStyle: React.CSSProperties = {
            position: "relative",
            background: "initial",
        };

        const blurStyle: React.CSSProperties = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            filter: "blur(40px)",
            background: pageStyle.background,
        };

        const modalContentStyle: React.CSSProperties = {
            display: "flex",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.59)",
            borderRadius: "8px",
        };

        return (
            <div className="mx_AuthPage" style={pageStyle}>
                <div className="mx_AuthPage_modal" style={modalStyle}>
                    <div className="mx_AuthPage_modalBlur" style={blurStyle} />
                    <div className="mx_AuthPage_modalContent" style={modalContentStyle}>
                        {this.props.children}
                    </div>
                </div>
                <VectorAuthFooter />
            </div>
        );
    }
}
