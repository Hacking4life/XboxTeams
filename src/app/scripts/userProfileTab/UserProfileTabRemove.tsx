import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";


export interface IUserProfileTabRemoveState extends ITeamsBaseComponentState {
    value: string;
}
export interface IUserProfileTabRemoveProps {

}

/**
 * Implementation of User Profile remove page
 */
export class UserProfileTabRemove  extends TeamsBaseComponent<IUserProfileTabRemoveProps, IUserProfileTabRemoveState> {

    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));

        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.appInitialization.notifySuccess();
        } else {
        }
    }

    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div>
                            <Header content="You're about to remove this tab..." />
                            <Text content="Removing the tab removes all your sign in cache from the system and requires yo to relogin the next time." />
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
