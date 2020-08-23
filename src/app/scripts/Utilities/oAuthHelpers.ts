// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SimpleGraphClient } from './simple-graph-client';

/**
 * These methods call the Microsoft Graph API. The following OAuth scopes are used:
 * 'openid' 'profile' 'User.Read'
 * for more information about scopes see:
 * https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
 */
export class OAuthHelpers {
    /**
     * Send the user their Graph Display Name from the bot.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async listMe(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.listMe(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.listMe(): `tokenResponse` cannot be undefined.');
        }

        // Pull in the data from Microsoft Graph.
        const client = new SimpleGraphClient(tokenResponse.token);
        const me = await client.getMe();

        await context.sendActivity(`You are ${ me.displayName } , ${me.mail}.`);
    }

    /**
     * Send the user their Graph Email Address from the bot.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param {TokenResponse} tokenResponse A response that includes a user token.
     */
    static async sendMail(context, tokenResponse) {
        if (!context) {
            throw new Error('OAuthHelpers.sendMail(): `context` cannot be undefined.');
        }
        if (!tokenResponse) {
            throw new Error('OAuthHelpers.sendMail(): `tokenResponse` cannot be undefined.');
        }

        // Pull in the data from Microsoft Graph.
        const client = new SimpleGraphClient(tokenResponse.token);
        const me = await client.sendMail();

        await context.sendActivity(`Your email has been sent`);
    }
}

exports.OAuthHelpers = OAuthHelpers;
