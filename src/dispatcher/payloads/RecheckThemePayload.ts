/*
Copyright 2024 New Vector Ltd.
Copyright 2020 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { ActionPayload } from "../payloads";
import { Action } from "../actions";

export interface RecheckThemePayload extends ActionPayload {
    action: Action.RecheckTheme;

    /**
     * Optionally specify the exact theme which is to be loaded.
     */
    forceTheme?: string;
}
