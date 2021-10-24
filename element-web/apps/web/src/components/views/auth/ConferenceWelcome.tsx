import React from "react";
import { Button, Heading } from "@vector-im/compound-web";

import { _t } from "../../../languageHandler";
import SdkConfig from "../../../SdkConfig.ts";


const ConferenceWelcome: React.FC = () => {
    const brand = SdkConfig.get("brand");
    const branding = SdkConfig.getObject("branding");
    const logoUrl = branding.get("auth_header_logo_url");

    return (
        <div className="mx_DefaultWelcome mx_ConferenceWelcome">
            <a href={branding.get("logo_link_url")} className="mx_DefaultWelcome_logo">
                <img src={logoUrl} alt={brand} />
            </a>
            <Heading as="h1" weight="semibold">
                {_t("welcome|title_generic", { brand })}
            </Heading>

            <div className="mx_ConferenceWelcome_content">
                <p>
                    The remote part of our conference uses <a href="https://matrix.org/">Matrix</a>,
                    an open, decentralized chat network.  This website is a Matrix client that
                    integrates features of the conference.
                </p>

                <p>
                    Please see <a href="https://seagl.org/attend">How to Attend</a> for complete
                    information on how to access the conference with a temporary or existing Matrix
                    account.
                </p>

                <Heading as="h2" size="sm" weight="semibold">
                    Option 1: Use a Temporary Account
                </Heading>

                <div className="mx_DefaultWelcome_buttons">
                    <Button as="a" href="#/register?hs=ephemeral" kind="primary" size="md">
                        Create Temporary Account
                    </Button>
                    <Button as="a" href="#/login?hs=ephemeral" kind="secondary" size="md">
                        Sign Back In
                    </Button>
                </div>

                <Heading as="h2" size="sm" weight="semibold">
                    Option 2: Bring your own Matrix account
                </Heading>

                <div className="mx_DefaultWelcome_buttons">
                    <Button as="a" href="#/login?hs=byo" kind="primary" size="md">
                        Sign in with other Matrix account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConferenceWelcome;
