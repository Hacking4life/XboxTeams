import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
import '../../web/styles/gamercard.css';
var $ = require("jquery");
import 'bootstrap';
import { shareDeepLink } from "@microsoft/teams-js";
const queryString = require('query-string');
import {Share} from "../ShareButton/Share"

// https://codepen.io/edlin/pen/AXzbXw
/**
 * State for the userProfileTabTab React component
 */

export interface IGamerCardState extends ITeamsBaseComponentState {
  entityId?: string;
  Name: string;
  Location: string;
  Gamerscore: string;
  Accounttier: string;
  Reputation: string;
  GamerTag: string;
  Gamerpic: string;
  titles: Array<any>[];
  dataloaded: boolean

}

export interface IGamerCardProps {

}

export interface GamercardProp {
}
export class gamercard extends TeamsBaseComponent<IGamerCardProps, IGamerCardState> {


  public componentDidUpdate() {
    $(function () {
      $('.js-header-toggle').click(function (e) {
        e.preventDefault;
        $('.heading').toggleClass('-alt');
      });
    });
  }
  public async getUserProfile(token: AuthToken) {
    return axios({
      method: 'post',
      baseURL: 'https://cors-anywhere.herokuapp.com/https://profile.xboxlive.com/',   /// will be removed once ajits node package is available
      url: '/users/batch/profile/settings',
      data: {
        userIds: [`${token.userXUID}`, "2535459213263004"],
        settings: ['GameDisplayName', 'AppDisplayName', 'AppDisplayPicRaw', 'GameDisplayPicRaw', 'PublicGamerpic', 'ShowUserAsAvatar', 'Gamerscore', 'Gamertag', 'AccountTier', 'TenureLevel', 'XboxOneRep', 'PreferredColor', 'Location', 'Bio', 'Watermarks', 'RealName', 'RealNameOverride']
      },
      headers: {
        'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
        timeout: 1000
      }
    })

  }
  //   public async getUserProfiles(token: AuthToken) {
  //     return axios({
  //         method: 'post',
  //         baseURL: 'https://profile.xboxlive.com/',   /// will be removed once ajits node package is available
  //         url: '/users/batch/profile/settings',
  //         data: {
  //             userIds: [`${token.userXUID}`,"2535459213263004"],
  //             settings: ['GameDisplayName', 'AppDisplayName', 'AppDisplayPicRaw', 'GameDisplayPicRaw', 'PublicGamerpic', 'ShowUserAsAvatar', 'Gamerscore', 'Gamertag', 'AccountTier', 'TenureLevel', 'XboxOneRep', 'PreferredColor', 'Location', 'Bio', 'Watermarks', 'RealName', 'RealNameOverride']
  //         },
  //         headers: {
  //             'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
  //             'Access-Control-Allow-Origin':'*',
  //             timeout: 1000
  //         }
  //     })

  // }

  public async gettitles(token: AuthToken) {
    return axios({
      method: 'get',
      baseURL: 'https://cors-anywhere.herokuapp.com/https://achievements.xboxlive.com/',   /// will be removed once ajits node package is available
      url: `/users/xuid(${token.userXUID})//history/titles`,
      headers: {
        'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
        timeout: 1000
      }
    })
  }

  public async componentWillMount() {
    this.setState({ titles: [], dataloaded: false });

    const token: AuthToken = queryString.parse(location.search);
    var authService = new AuthenticationService();
    // var token: AuthToken = authService.GetTokenFromFile();
    // let token: AuthToken = await authService.getUserToken("arunjb2016@gmail.com", "Clannad@01");
    var context = this;
    axios.all([this.getUserProfile(token), this.gettitles(token)]).then(axios.spread(function (acct, ttls) {
      context.setState(
        {
          GamerTag: acct.data.profileUsers[0].settings[7].value,
          Gamerpic: acct.data.profileUsers[0].settings[4].value,
          Name: acct.data.profileUsers[0].settings[15].value,
          Location: acct.data.profileUsers[0].settings[12].value,
          Gamerscore: acct.data.profileUsers[0].settings[6].value,
          Accounttier: acct.data.profileUsers[0].settings[8].value,
          Reputation: acct.data.profileUsers[0].settings[10].value,
          titles: ttls.data.titles,
          dataloaded: true
        }
      )

    }));
  }


  private getrecentTitles(): any {
    if (this.state.titles == null) { return (<li>None</li>); }
    else {
      return (
        this.state.titles.map((value, index) => {
          return <li key={index}>{value}</li>
        })
      );

    }
  }
  public render() {
    if (this.state.dataloaded) {
      return (     
        <div>
          <div id="container">
            <span id="profile">
              <div id="profile-header"><img className="avatar" src={this.state.Gamerpic} />
                <div className="gamertag">{this.state.GamerTag}</div>
                <div id="gamerscore">
                  <img className="gamerscore-icon" style={{ width: '120px', height: '120px' }} src={this.state.Gamerpic} /><div className="gamerscore">{this.state.Gamerscore}</div>
                </div>
              </div>
              <span id="profile-main">
                <div id="profile-games">
                  <div className="profile-games-heading">Latest Games Played</div>
                  {this.state.titles.map((value, index) => {
                    return (
                      <div>
                        <div id="profile-game">
                          <img className="game-icon" />
                          <div className="game-title">{this.state.titles[index]['name']}</div>
                          <div className="game-last-played">Last played {this.state.titles[index]['lastUnlock']}</div>
                        </div>
                        <div id="profile-game-stats">
                          <div id="profile-game-gamerscore">
                            <div className="game-gamerscore-title">Gamerscore</div>
                            <div className="game-gamerscore-container">
                              <div className="game-gamerscore-percentage" style={{ width: '29.4%' }} />
                              <div className="game-gamerscore-earned">{this.state.titles[index]['currentGamerscore']} / {this.state.titles[index]['maxGamerscore']}</div>
                            </div>
                          </div>
                          <div id="profile-game-achievements">
                            <div className="game-achievements-title">Achievements</div>
                            <div className="game-achievements-container">
                              <div className="game-achievements-percentage" style={{ width: '24%' }} />
                            </div>
                            <div className="game-achievements-earned">{this.state.titles[index]['earnedAchievements']} / 25</div>
                          </div>
                        </div>
                      </div>)
                  })}
                </div>
                <div id="profile-bio">
                  <div className="avatar-location-heading">Location</div>
                  <div className="avatar-location">{this.state.Location}</div>
                  <div className="avatar-motto-heading">Account Tier</div>
                  <div className="avatar-motto">{this.state.Accounttier}</div>
                  <div className="avatar-bio-heading">Reputation</div>
                  <div className="avatar-bio">{this.state.Reputation}?</div>
                  <div className="avatar-tenure">10</div>
                </div>
              </span>
            <Share invoke={{type:'gc',img:this.state.Gamerpic,gt:this.state.GamerTag}}></Share>
            </span>
          </div>
        </div>
      );
    }
    else if (!this.state.dataloaded) {
      return (
        <div className="smart-glass">
          <h1>Xbox</h1>
          <div className="logo">
            <div className="circle">
              <div className="circle">
                <div className="circle">
                </div>
              </div>
            </div>
            <div className="hold-x">
              <div className="xbox" />
            </div>
          </div>
          <div className="loading-text">
            Please wait while the data is beign loaded
          </div>
        </div>

      )
    }
  }
}


