import {
    AttachmentLayoutTypes, CardAction,
    TeamsActivityHandler,
    BotFrameworkAdapter,
    MemoryStorage,
    ConversationState,
    TurnContext, ActionTypes, CardFactory, UserState
} from 'botbuilder';
export  class ShareActivity
{

    public getshareadaptivecard(res:any) : any
    {
        // let currentUser: any;
        // microsoftTeams.getContext(function (teamsctx) {
        //    currentUser=teamsctx.userPrincipalName
          
        //   });
        console.info(res.data);
        let adaptvecard : any
            switch(res.data.type)
            {
                case "clip":{
                    adaptvecard=  CardFactory.videoCard(
                        '2018 Imagine Cup World Championship Intro',
                        [{ url: res.url }],
                        [{
                            title: 'Lean More',
                            type: 'openUrl',
                            value: 'https://channel9.msdn.com/Events/Imagine-Cup/World-Finals-2018/2018-Imagine-Cup-World-Championship-Intro'
                        }],
                        {
                            subtitle: 'by Microsoft',
                            text: 'Microsoft\'s Imagine Cup has empowered student developers around the world to create and innovate on the world stage for the past 16 years. These innovations will shape how we live, work and play.'
                        }
                    );
                    break;
                }
                case "screenshots":{
                    let url : string= decodeURI(res.data.img);
                    adaptvecard = CardFactory.heroCard(
                        `${res.data.title}`,
                        `User has shared the Game Screenshot.Click the button to view it in your browser`,
                        [url],
                        [
                            {
                                title: 'View',
                                type: ActionTypes.OpenUrl,
                                value: url
                            }                          
                        ]
                    );
                    break;
                }
                case "gc":{
                    const AdaptiveCard =  require("../app/scripts/GamerCard/gamercard.json");
                    CardFactory.adaptiveCard(AdaptiveCard);
                    break;
                }
                case "achv":{
                   let url : string= decodeURI(res.data.img);
                    adaptvecard = CardFactory.heroCard(
                        `${res.data.title} - ${res.data.subtext}`,
                        `User has shared his recent acheivement. Click the button to view it in your browser`,
                        ["https://nightwing.stevivor.com/wp-content/uploads/2018/07/achievements-1000px.jpg"],
                        [
                            {
                                title: 'View',
                                type: ActionTypes.OpenUrl,
                                value: url
                            }                          
                        ]
                    );
                    break;
                }
               
            }
            return adaptvecard;
           
    }
}