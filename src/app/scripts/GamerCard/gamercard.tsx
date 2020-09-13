import * as React from "react";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
import '../../web/styles/gamercard.css';
var $ = require("jquery");
import 'bootstrap';
const queryString = require('query-string');
import { Share } from "../ShareButton/Share"
import { Provider, themes } from "@fluentui/react-northstar";
import { ErrorMessage } from "../ErrorMessage/error";
import * as https from "https";
import * as querystring from "querystring";

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
  restApiError: boolean

}

export interface IGamerCardProps {

}

export interface GamercardProp {
}
export class gamercard extends TeamsBaseComponent<IGamerCardProps, IGamerCardState> {

  constructor(props) {
    super(props);
    this.gettitles.bind(this);
    this.getUserProfile.bind(this);

  }
  public componentDidUpdate() {
    $(function () {
      $('.js-header-toggle').click(function (e) {
        e.preventDefault;
        $('.heading').toggleClass('-alt');
      });
    });
  }
  public async getUserProfile(token: AuthToken) {
    const postData = querystring.stringify({
      xuid: token.userXUID,
      uhash: token.userHash,
      token: token.XSTSToken
    });
    const options = {
      path: "https://xboxliveauthenticatorservice.azurewebsites.net/profile",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    let profile_json=""; 
    let ctx=this;
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on("data" , function (chunk) {
        profile_json += chunk;
      });
      res.on("end",  function () {
        try {
          const profile: any = JSON.parse(profile_json.toString());
          ctx.gettitles(token, profile);
        }
        catch (ex) {
          console.log(ex);
          ctx.setState({
            restApiError: true,
            dataloaded: false
          });
        }
      });
    });
    req.on("error", (e) => {
      console.error(e);
      ctx.setState({
        restApiError: true,
        dataloaded: false
      });
    });
    req.write(postData);
    req.end();
  }
  public async gettitles(token: AuthToken, data) {
    const postData = querystring.stringify({
      xuid: token.userXUID,
      uhash: token.userHash,
      token: token.XSTSToken
    });
    const options = {
      path: "https://xboxliveauthenticatorservice.azurewebsites.net/titles",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    let titles_json=""; 
    let ctx =this;
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on("data" , function (chunk) {
        titles_json += chunk;
      });
      res.on("end",  function () {
        try {
          const titles_data: any = JSON.parse(titles_json.toString());
          ctx.setState(
            {
              GamerTag: ctx.search("Gamertag", data),
              Gamerpic: ctx.search("GameDisplayPicRaw", data),
              Name: ctx.search("RealName", data),
              Location: ctx.search("Location", data),
              Gamerscore: ctx.search("Gamerscore", data),
              Accounttier: ctx.search("AccountTier", data),
              Reputation: ctx.search("XboxOneRep", data),
              titles: titles_data.titles,
              dataloaded: true,
              restApiError: false
            }
          )
        }
        catch (ex) {
          console.log(ex);
          ctx.setState({
            restApiError: true
          });
        }
      });
    });
    req.on("error", (e) => {
      console.error(e);
      ctx.setState({
        restApiError: true
      });
    });
    req.write(postData);
    req.end();

  }

  public search(key, array: Array<any>): string {
    for (let i = 0; i <= array.length - 1; i++) {
      if (array[i].id == key) {
        return array[i].value;
      }
    }
    return "";
  }

  public async componentWillMount() {
    this.setState({ titles: [], dataloaded: false, restApiError: false });
    const token: AuthToken = queryString.parse(location.search);
    var authService = new AuthenticationService();
    var context = this;
    this.getUserProfile(token);
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
    if (this.state.dataloaded && !this.state.restApiError) {
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
                  <div className="avatar-bio">{this.state.Reputation}</div>
                  <div className="avatar-tenure">10</div>
                </div>
              </span>
              <Share invoke={{ type: 'gc', img: this.state.Gamerpic, gt: this.state.GamerTag }}></Share>
            </span>
          </div>
        </div>
      );
    } else if (this.state.restApiError) {
      return (
        <Provider theme={themes.teams} >
          <ErrorMessage />
        </Provider>
      )
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


