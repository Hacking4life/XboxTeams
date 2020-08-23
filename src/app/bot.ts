// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AttachmentLayoutTypes, CardAction,
    TeamsActivityHandler,
    BotFrameworkAdapter,
    MemoryStorage,
    ConversationState,
    TurnContext, ActionTypes, CardFactory, UserState
} from 'botbuilder';
import { AuthBot } from "../app/SignIn/authBot"
import { MainDialog } from "../app/SignIn/signInDialog"

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
export const adapter = new BotFrameworkAdapter({
    appId: "d7777f39-1e8f-46e8-8aaf-227fcfa4429c",
    appPassword: "L8EA~VXr5D.S8pHYJfKMPkZ3~_L3-nSY2A",
});

adapter.onTurnError = async (context, error) => {
    const errorMsg = error.message
        ? error.message
        : `Oops. Something went wrong!`;
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    // Clear out state
    await conversationState.delete(context);
    // Send a message to the user
    await context.sendActivity(errorMsg);

    // Note: Since this Messaging Extension does not have the messageTeamMembers permission
    // in the manifest, the bot will not be allowed to message users.
};

// Define state store for your bot.
const memoryStorage = new MemoryStorage();

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);


export class EchoBot extends TeamsActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            console.info("Activity received")
            if (context.activity.type == "message") {
                TurnContext.removeRecipientMention(context.activity);
                console.info(context.activity.value);
                if (context.activity.text == null) {
                    return;
                }

                const text: string = context.activity.text.trim().toLocaleLowerCase();
                if (text == "help") {
                    const gc = CardFactory.thumbnailCard(
                        'Get Your Gamer Card',
                        [{ url: 'https://erikpersson.files.wordpress.com/2008/12/avatar-body.png' }],
                        [{
                            title: 'Show my GamerCard',
                            type: 'imBack',
                            value: 'gamercard'
                        }],
                        {
                            subtitle: 'View and Share your App generated stylish GamerCard'
                        }
                    );
                    const family = CardFactory.thumbnailCard(
                        'Xbox Family settings',
                        [{ url: 'https://www.clipartmax.com/png/middle/112-1126186_xbox-desktop-icon-by-dracogradezero-xbox-360-icon.png' }],
                        [{
                            title: 'View Family settings',
                            type: 'imBack',
                            value: 'family'
                        }],
                        {
                            subtitle: 'View your Xbox Family settings'
                        }
                    );
                    const achievements = CardFactory.thumbnailCard(
                        'Recent Acheivements',
                        [{ url: 'https://i.pinimg.com/736x/2f/8f/43/2f8f4329ab44a4788408212737f84db1.jpg' }],
                        [{
                            title: 'Get my Achievements',
                            type: 'imBack',
                            value: 'achievements'
                        }],
                        {
                            subtitle: 'View and share your recent Game acheivements'
                        }
                    );
                    const screenshots = CardFactory.thumbnailCard(
                        'ScreenShots',
                        [{ url: 'https://i.pinimg.com/originals/a0/ed/12/a0ed12cff5d360e0f732bd113fe9f12c.jpg' }],
                        [{
                            title: 'Screenshots',
                            type: 'imBack',
                            value: 'screenshots'
                        }],
                        {
                            subtitle: 'View and share your recent Screenshots captured from Xbox'
                        }
                    );
                    const gameclips = CardFactory.thumbnailCard(
                        'GameClips',
                        [{ url: 'https://dcassetcdn.com/design_img/2854067/607318/607318_15690304_2854067_8aa71568_image.jpg' }],
                        [{
                            title: 'GameClips',
                            type: 'imBack',
                            value: 'gameclips'
                        }],
                        {
                            subtitle: 'View and share your recent gameclips captured from Xbox'

                        }
                    );

                    await context.sendActivity({
                        attachmentLayout: AttachmentLayoutTypes.Carousel,
                        attachments: [gc, family, achievements, screenshots, gameclips]
                    });
                }
                else if (text == 'achievements' || text == 'gameclips' || text == 'screenshots' || text == 'family' || text == 'gamercard') {
                    var deeplink = 'https://teams.microsoft.com/l/entity/d7777f39-1e8f-46e8-8aaf-227fcfa4429c/xboxlive?webUrl=https://tasklist.example.com/123&label=Xbox Live';
                    console.info(deeplink);
                    const card = CardFactory.heroCard(
                        'Coming Soon',
                        ['https://img.freepik.com/free-vector/coming-soon-message-illuminated-with-light-projector_1284-3622.jpg?size=338&ext=jpg'],
                        [
                            {
                                title: 'Xbox Live',
                                type: ActionTypes.OpenUrl,
                                value: deeplink,
                                text: 'Chat support for this functionality is not availabl yet , click the button to navigate to our custom Tab'
                            }
                        ],
                    )
                    await context.sendActivity({ attachments: [card] });
                }
                else if (text == 'multiplayer') {
                    var AdaptiveCard = require('../app/scripts/userProfileTab/Multiplayer.json');
                    const card = CardFactory.adaptiveCard(AdaptiveCard);
                    await context.sendActivity({ attachments: [card] });
                }
                else if (text == 'invite') {
                    const dialog = new MainDialog();

                    const bot = new AuthBot(conversationState, userState, dialog);

                    await bot.run(context);
                }
                else {
                    const card = CardFactory.heroCard(
                        'Welcome to Xbox Teams',
                        ['https://hyperpix.net/wp-content/uploads/2019/08/xbox-logo-font-download.jpg'],
                        [
                            {
                                title: 'Xbox Live',
                                type: ActionTypes.OpenUrl,
                                value: 'https://www.xbox.com/en-IN/live'
                            },
                            {
                                title: 'Help',
                                type: ActionTypes.ImBack,
                                value: 'help'
                            },
                            {
                                title: 'Gaming clubs',
                                type: ActionTypes.ImBack,
                                value: 'gameclubs'
                            },
                            {
                                title: 'Multiplayer Events',
                                type: ActionTypes.ImBack,
                                value: 'multiplayer'
                            },
                            {
                                title: 'Invite Your Friends',
                                type: ActionTypes.ImBack,
                                value: 'invite'
                            }
                        ]
                    );

                    await context.sendActivity({ attachments: [card] });
                }
            }
            else {
                console.log(context.activity.type)
            }
        });
    }


    // public getScreenshots(token: AuthToken) {
    //     console.info("getScreenshots");
    //     if (token != null || typeof (token) != "undefined") {
    //       const postData = querystring.stringify({
    //         xuid: token.userXUID,
    //         uhash: token.userHash,
    //         token: token.XSTSToken
    //       });
    //       const options = {
    //         path: "https://xboxliveauthenticatorservice.azurewebsites.net/screenshots",
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/x-www-form-urlencoded",
    //           "Content-Length": postData.length
    //         }
    //       };
    //       var context = this;
    //       const req = https.request(options, (res) => {
    //         console.log("statusCode:", res.statusCode);
    //         console.log("headers:", res.headers);
    //         res.on("data", (d) => {
    //           try {
    //               console.info(d)
    //             var string = new TextDecoder("utf-8").decode(d);
    //             const screeshots = JSON.parse(d);
    //             console.info(screeshots)
    //           }
    //           catch
    //           {
    //             window.location.reload(false);
    //           }
    //         });
    //       });
    //       req.on("error", (e) => {
    //         console.info("error");
    //         console.info(e);
    //       });
    //       req.write(postData);
    //       req.end();
    //     }
    //   }

    // public getAchievements(token: AuthToken) {
    //     if (token != null || typeof (token) != "undefined") {
    //         const options = {
    //         // hostname:"cors-anywhere.herokuapp.com/https://achievements.xboxlive.com/",
    //           path: `https://cors-anywhere.herokuapp.com/https://achievements.xboxlive.com//users/xuid(${token.userXUID})/achievements?unlockedOnly=true&orderBy=UnlockTime`,
    //           method: "GET",
    //         //   port: 443,
    //           headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //             'x-xbl-contract-version': '2', 
    //             'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`
    //           }
    //         };
    //         const req = https.request(options, (res) => {
    //             console.info("statusCode: ", res.statusCode);
    //             console.info("headers: ", res.headers);
    //           res.on("data", (d) => {
    //             try {
    //                 console.info(d)
    //             }
    //             catch (ex) {
    //               console.info(ex)
    //               // window.location.reload(false);
    //             }   
    //           });
    //         });
    //         req.on("error", (e) => {
    //           console.info(e);
    //         });
    //         req.end();
    //       }

    // }
}
