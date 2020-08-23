// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Client } from '@microsoft/microsoft-graph-client';


/**
 * This class is a wrapper for the Microsoft Graph API.
 * See: https://developer.microsoft.com/en-us/graph for more information.
 */
export class SimpleGraphClient {
    _token : any;
    graphClient  :any;
    constructor(token) {
        if (!token || !token.trim()) {
            throw new Error('SimpleGraphClient: Invalid token received.');
        }

        this._token = token;

        // Get an Authenticated Microsoft Graph client using the token issued to the user.
        this.graphClient = Client.init({
            authProvider: (done) => {
                done(null, this._token); // First parameter takes an error if you can't get an access token.
            }
        });
    }

    /**
     * Collects information about the user in the bot.
     */
    async getMe() {
        return await this.graphClient
            .api('/me')
            .get().then((res) => {
                return res;
            });
    }

    async sendMail() {
        const mail = {
            subject: "Microsoft Graph JavaScript Sample",
            toRecipients: [
                {
                    emailAddress: {
                        address: "arpn@microsoft.com",
                    },
                },
            ],
            body: {
                content: "<h1>MicrosoftGraph JavaScript Sample</h1>Check out https://github.com/microsoftgraph/msgraph-sdk-javascript",
                contentType: "html",
            },
        };

        try {
            return await this.graphClient.api("/me/sendMail").post({ message: mail });
            
        } catch (error) {
            throw error;
        }
    }
}

exports.SimpleGraphClient = SimpleGraphClient;



