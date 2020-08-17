import * as React from 'react';
import { StarIcon, DownloadIcon, MoreIcon } from '@fluentui/react-icons-northstar';
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
import * as https from "https";
import * as querystring from "querystring";
import CardExampleCentered from "../GamerTag/Card"


export interface IGamerTagstate extends ITeamsBaseComponentState {
  gameClips: Array<any>

}

export interface IGamerTagProps {

}

export class gamerTag extends TeamsBaseComponent<IGamerTagProps, IGamerTagstate> {


  public changeGamerTag(token: AuthToken, newgt: string) {
    var xuid: number = +token.userXUID;
    return axios({
      method: 'post',
      baseURL: "https://cors-anywhere.herokuapp.com/https://accounts.xboxlive.com",   /// will be removed once ajits node package is available
      url: '/users/current/profile/gamertag',
      data: {
        "gamertag": newgt,
        "preview": false,
        "reservationId": xuid
      },
      headers: {
        'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
        timeout: 1000
      }
    })
  }

  public test(token, newgt) {
    if (token != null || typeof (token) != "undefined") {
      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken,
        newgt: newgt
      });
      const options = {
        path: "http://localhost:3001/gamertag",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      var context = this;
      const req = https.request(options, (res) => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);
        res.on("data", (d) => {
          try {
            const clips: any = JSON.parse(d);
            console.log(clips);
            context.setState({
              gameClips: clips.gameClips
            })
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
  public reserverGamerTag(token: AuthToken, newgt: string) {
    if (token != null || typeof (token) != "undefined") {
      return axios({
        method: 'post',
        baseURL: "https://cors-anywhere.herokuapp.com/https://user.mgt.xboxlive.com",   /// will be removed once ajits node package is available
        url: '/gamertags/reserve',
        data: {
          "Gamertag": newgt,
          "ReservationId": token.userXUID
        },
        headers: {
          'x-xbl-contract-version': '1', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
          timeout: 1000
        }
      })
    }
  }

  public async componentWillMount() {
    this.setState({ gameClips: [] });
  }

  public componentDidMount() {
    // var authService = new AuthenticationService();
    // var token: AuthToken = authService.GetTokenFromFile();
    // var context = this;
    // var newgt: string = "L Lewliet564";
    // this.test(token, newgt);
    // axios.all([this.reserverGamerTag(token,newgt)]).then(axios.spread(function (acct) {
    // if(acct.status==200)
    // {
    //   axios.all([context.changeGamerTag(token,newgt)]).then(axios.spread(function (final) {
    //     console.log(final);
    //   }))
    // }
    // }))

  }

  public render() {
    return (
      <div>......</div>
    )

  }
}