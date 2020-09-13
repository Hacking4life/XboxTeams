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
import { Provider, themes} from "@fluentui/react-northstar";
import {ErrorMessage} from "../ErrorMessage/error";


export interface IfriendsState extends ITeamsBaseComponentState {
  friendsUsers: Array<any>
  dataloaded: boolean
  restApiError:boolean
}

export interface IfriendsProps {
  username: string, password: string
}

export interface friendscardProp {
}
export class Friends extends TeamsBaseComponent<IfriendsProps, IfriendsState> {
constructor(props)
{
  super(props);
  this.getMembers.bind(this);
  this.getfriendata.bind(this);
}

  getfriendata(token: AuthToken, xuid: any) {
    
    const postData = querystring.stringify({
      xuid:  xuid,
      uhash: token.userHash,
      token: token.XSTSToken
    });
    const options = {
      path: "https://xboxliveauthenticatorservice.azurewebsites.net/Friendsprofile",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    let friendsdata_json=""; 
    let ctx=this;
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      res.on("data" , function (chunk) {
        friendsdata_json += chunk;
      });
      res.on("end",  function () {
        try {
          const profiles: any = JSON.parse(friendsdata_json.toString());
          ctx.setState({
            dataloaded: true,
            friendsUsers: profiles.profileUsers,
            restApiError:false
          })
        }
        catch (ex) {
          console.log(ex);
          ctx.setState({
            restApiError: true,
            dataloaded: false
          });
        } });
 
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
      let friends_json=""; 
    let ctx=this;
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on("data" , function (chunk) {
          friends_json += chunk;
        });
        res.on("end",  function () {
            const data: any = JSON.parse(friends_json.toString());
            var xuids: Array<any> = data.people;
            var userIds: string[] = [];
            for (let i = 0; i <= data.totalCount - 1; i++) {
              userIds.push(xuids[i].xuid)
            }
            ctx.getfriendata(token,userIds);
        });
      });
      req.on("error", (e) => {
        console.error(e);
        ctx.setState({
          dataloaded: false,
          restApiError:true
        })
      });
      req.write(postData);
      req.end();
    }
  }

  public async componentWillMount() {
    this.setState({ friendsUsers: [], dataloaded: false,restApiError:false })
    var authService = new AuthenticationService();
    // var token: AuthToken = authService.GetTokenFromFile();
    let token: AuthToken = await authService.getUserToken(this.props.username, this.props.password);
    this.getMembers(token);
  }

  public render() {
    if (this.state.dataloaded && !this.state.restApiError) {
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
    } else if (this.state.restApiError)
    {
      return(
      <Provider theme={themes.teams} styles={{ backgroundColor: "#007b5e" }} > 
<ErrorMessage/>
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