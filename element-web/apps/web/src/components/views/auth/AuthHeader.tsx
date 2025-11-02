/*
Copyright 2019-2024 New Vector Ltd.
Copyright 2015, 2016 OpenMarket Ltd

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";

import AuthHeaderLogo from "./AuthHeaderLogo";
import LanguageSelector from "./LanguageSelector";
import AccessibleButton, { type ButtonEvent } from "../elements/AccessibleButton";

interface IProps {
    disableLanguageSelector?: boolean;

    onWelcomeClick(): void;
}

export default class AuthHeader extends React.Component<IProps> {
    public onWelcomeClick = (ev: ButtonEvent): void => {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onWelcomeClick();
    };

    public render(): React.ReactNode {
        return (
            <div className="mx_AuthHeader">
                <AccessibleButton kind="link_inline" onClick={this.onWelcomeClick}>
                    ‹ SeaGL instructions
                </AccessibleButton>
                <LanguageSelector disabled={this.props.disableLanguageSelector} />
            </div>
        );
    }
}
