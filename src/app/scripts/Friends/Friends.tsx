// https://codepen.io/junchoon14/pen/MLNxox


import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
import "../../web/styles/friends.css"
import * as https from "https";
import * as querystring from "querystring";


export interface IfriendsState extends ITeamsBaseComponentState {
  friendsUsers: Array<any>
  dataloaded: boolean
  Gamerscore: string;
  GamerTag: string;
  Gamerpic: string;
}

export interface IfriendsProps {
  username: string, password: string
}

export interface friendscardProp {
}
export class Friends extends TeamsBaseComponent<IfriendsProps, IfriendsState> {


  getfriendata(token: AuthToken, xuid: any) {
    return axios({
      method: 'post',
      baseURL: 'https://cors-anywhere.herokuapp.com/https://profile.xboxlive.com/',   /// will be removed once ajits node package is available
      url: '/users/batch/profile/settings',
      data: {
        userIds: xuid,
        settings: ['GameDisplayName', 'AppDisplayName', 'AppDisplayPicRaw', 'GameDisplayPicRaw', 'PublicGamerpic', 'ShowUserAsAvatar', 'Gamerscore', 'Gamertag', 'AccountTier', 'TenureLevel', 'XboxOneRep', 'PreferredColor', 'Location', 'Bio', 'Watermarks', 'RealName', 'RealNameOverride']
      },
      headers: {
        'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
        timeout: 1000
      }
    })
  }
  public getMembers(token: AuthToken) {
    if (token != null && typeof (token) != "undefined") {

      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken
      });
      const options = {
        path: "https://xboxliveauthenticatorservice.azurewebsites.net/getfriends",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      var context = this;
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          try {
            var string = new TextDecoder("utf-8").decode(d);
            const data: any = JSON.parse(d);
            var xuids: Array<any> = data.people;
            var userId: string[] = [];
            for (let i = 0; i <= data.totalCount - 1; i++) {
              userId.push(xuids[i].xuid)
            }
            var context2 = context;
            axios.all([context.getfriendata(token, userId)]).then(axios.spread(function (acct) {
              context2.setState({
                dataloaded: true,
                friendsUsers: acct.data.profileUsers,
                Gamerscore: acct.data.profileUsers[0].settings[6].value,
                GamerTag: acct.data.profileUsers[0].settings[7].value,
                Gamerpic: acct.data.profileUsers[0].settings[4].value
              })

            }))

          }
          catch
          {
            window.location.reload(false);
          }


        });
      });
      req.on("error", (e) => {
        console.error(e);
      });
      req.write(postData);
      req.end();

    }
  }

  public async componentWillMount() {
    this.setState({ friendsUsers: [], dataloaded: false })
    var authService = new AuthenticationService();
    // var token: AuthToken = authService.GetTokenFromFile();
    let token: AuthToken = await authService.getUserToken(this.props.username, this.props.password);
    this.getMembers(token);
  }

  public render() {
    if (this.state.dataloaded) {
      let test: Array<any> = ["a", "a", "a", "a", "a", "a"]
      return (


        <div>

          <div className="container mt-5">
            <div className="row" id="data-panel">
              {this.state.friendsUsers.map((value, index) => {
                return (
                  <div className="col-6 col-sm-5 col-md-4 col-lg-3">
                    <div className="card mb-3 img-thumbnail">
                      <img className="card-img-top pointer" src={this.state.friendsUsers[index].settings[4].value} alt="Card image cap" data-toggle="modal" data-target="#show-mate-modal" data-id={602} />
                      <div className="card-body female-color">
                        {/* <div className="add-mark">
                    <img className="heart" id="love" src="https://png.pngtree.com/svg/20150326/4eed179c9c.png" alt="heartImg" data-id={602} />
                  </div> */}
                        <div className="info">
                          <h5 className="card-text">{this.state.friendsUsers[index].settings[7].value}</h5>
                        </div>
                      </div>
                    </div>
                  </div>)
              })}
            </div>
            <br></br>
            <div className="row" id="data-panel">
              <h2> Recommended friends</h2><br></br>
              {test.map((value, index) => {
                return (
                  <div className="col-6 col-sm-5 col-md-4 col-lg-3">
                    <div className="card mb-3 img-thumbnail">
                      <img className="card-img-top pointer" src="https://thedocspot.com/docspot_mobile/uploads/users/1544693959user-dummy.png" alt="Card image cap" data-toggle="modal" data-target="#show-mate-modal" data-id={603} />
                      <div className="card-body female-color">
                        <div className="add-mark">
                          <img className="heart" id="love" src="https://png.pngtree.com/svg/20150326/4eed179c9c.png" alt="heartImg" data-id={603} />
                        </div>
                        <div className="info">
                          <h5 className="card-text">Test data</h5>
                        </div>
                      </div>
                    </div>
                  </div>)
              })}
            </div>
          </div>
        </div>
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