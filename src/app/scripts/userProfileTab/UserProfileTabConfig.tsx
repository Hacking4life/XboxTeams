import * as React from "react";
import { Provider, Flex, Header, Input } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { List, Image } from '@fluentui/react-northstar'
import "../../web/styles/config.css"
export interface IUserProfileTabConfigState extends ITeamsBaseComponentState {
    value: string;
    contenturl: string;
    websiteUrl: string;
    removeurl: string
    suggestedDisplayName: string;
}

export interface IUserProfileTabConfigProps {

}

/**
 * Implementation of User Profile configuration page
 */
export class UserProfileTabConfig extends TeamsBaseComponent<IUserProfileTabConfigProps, IUserProfileTabConfigState> {



    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));

        if (await this.inTeams()) {
            microsoftTeams.initialize();

            microsoftTeams.getContext((context: microsoftTeams.Context) => {
                this.setState({
                    value: context.entityId
                });
                this.updateTheme(context.theme);
                microsoftTeams.settings.setValidityState(true);
                microsoftTeams.appInitialization.notifySuccess();
            });

            microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
                // Calculate host dynamically to enable local debugging
                const host = "https://" + window.location.host;
                microsoftTeams.settings.setSettings({
                    contentUrl: this.state.contenturl,
                    websiteUrl: this.state.websiteUrl,
                    suggestedDisplayName: this.state.suggestedDisplayName,
                    removeUrl: this.state.removeurl,
                    entityId: this.state.value,

                });
                saveEvent.notifySuccess();
            });
        } else {
        }
    }

    public onchange(ev) {
        const host = "https://" + window.location.host;
        switch (ev.selectedIndex) {
            case 0:
                this.setState({
                    contenturl: `${host}/userProfileTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                    websiteUrl: `${host}/userProfileTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                    suggestedDisplayName: "Xbox Live",
                    removeurl: `${host}/userProfileTab/remove.html?theme={theme}`
                })
                break;
            case 1:
                this.setState({
                    contenturl: `${host}/SmartGlass//?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                    websiteUrl: `${host}/SmartGlass//?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                    suggestedDisplayName: "SmartGlass",
                    removeurl: `${host}/userProfileTab/remove.html?theme={theme}`
                })
                break;

        }
        console.log(ev)
    }
    public render() {
        const items = [
            {
                key: 'Xbox Live',
                media: <Image src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/387_Xbox_logo-512.png" avatar />,
                header: 'Xbox Live',
                content: 'Custom Teams tab for Xbox live profile and Multiplayer gaming',


            },
            {
                key: 'Xbox Teams Remote',
                media: <Image src="https://store-images.s-microsoft.com/image/apps.25050.9007199266246811.03afb40b-8bc0-4672-875d-e3f558298e47.20e5926c-1b1e-463b-a68a-a00198908f23?mode=scale&q=90&h=300&w=300" avatar />,
                header: 'Teams Xbox remote',
                content: 'Control your Xbox Console using Teams from anywhere ',

            },
        ]

        return (
            <Provider theme={this.state.theme}>
                <div >
                    <Header styles={{ textAlign: "center" }} content="Please select the tab you wish to add" />
                    <br></br><br></br>
                    <List selectable defaultSelectedIndex={0} items={items} onSelectedIndexChange={(e, selectedIndexOption) => {
                        this.onchange(selectedIndexOption);

                    }} />
                </div>

            </Provider>
        );
    }
}
