import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
const queryString = require('query-string');
import { Provider, themes} from "@fluentui/react-northstar";
import {ErrorMessage} from "../ErrorMessage/error";
import * as https from "https";
import * as querystring from "querystring";

export interface IFamilyState extends ITeamsBaseComponentState {
  FamilyUsers: Array<any>
  dataloaded: boolean
  restApiError:boolean
}

export interface IFamilyProps {
}

export interface FamilycardProp {
}
export class family extends TeamsBaseComponent<IFamilyProps, IFamilyState> {

  constructor(props)
  {
    super(props);
    this.getMembers.bind(this);
  }

  public getMembers(token: AuthToken) {
    if (token != null && typeof (token) != "undefined") {
      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken
      });
      const options = {
        path: "https://xboxliveauthenticatorservice.azurewebsites.net/family",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      let family_json=""; 
      let ctx=this;
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on("data" , function (chunk) {
          family_json += chunk;
        });
        res.on("end",  function () {
          try {
            const family: any = JSON.parse(family_json.toString());
            ctx.setState({
              FamilyUsers: family.familyUsers,
              dataloaded: true,
              restApiError:false
            })
          }
          catch (ex) {
            console.log(ex);
            ctx.setState({
              restApiError: true,
              dataloaded: false
            });
            window.location.reload(false);
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
  }

  public async componentWillMount() {
    this.setState({ FamilyUsers: [], dataloaded: false ,restApiError:false})
    const token: AuthToken = queryString.parse(location.search);
    this.getMembers(token);
  }

  public render() {
    if (this.state.dataloaded && !this.state.restApiError) {
      return (<section id="team" className="pb-5">
        <div className="container">
          <h5 className="section-title h1">Your Family</h5>
          <div className="row">
            {this.state.FamilyUsers.map((value, index) => {
              return (<div className="col-xs-12 col-sm-6 col-md-4">
                <div className="image-flip">
                  <div className="mainflip flip-0">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <p><img className=" img-fluid" src="https://www.iconarchive.com/download/i98465/dakirby309/simply-styled/Xbox.ico" alt="card image" /></p>
                          <h4 className="card-title">{this.state.FamilyUsers[index].firstName}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="backside">
                      <div className="card">
                        <div className="card-body text-center mt-4">
                          <h4 className="card-title">{this.state.FamilyUsers[index].gamerTag}</h4>
                          <p className="card-text"><strong>Xbox Id : </strong>{this.state.FamilyUsers[index].xuid}</p>
                          <p className="card-text"><strong>Member : </strong>{this.state.FamilyUsers[index].role}</p>
                          <p className="card-text"><strong>Activity Reporting : </strong>{String(this.state.FamilyUsers[index].activityReporting)}</p>
                          <p className="card-text"><strong>Allow Unrated Content : </strong>{String(this.state.FamilyUsers[index].allowUnratedContent)}</p>
                          <p className="card-text"><strong>Apply Ratings to Browse : </strong>{String(this.state.FamilyUsers[index].applyRatingsToBrowse)}</p>
                          <p className="card-text"><strong>Maturity Level : </strong>{this.state.FamilyUsers[index].maturityLevel}</p>
                          <p className="card-text"><strong>Purchase type : </strong>{this.state.FamilyUsers[index].allowPurchaseAndDownloads}</p>
                          <p className="card-text" style={{ visibility: 'hidden' }}>This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button</p>
                          <ul className="list-inline">
                            <li className="list-inline-item">
                              <a className="social-icon text-xs-center" target="_blank" href="">
                                <i className="fa fa-facebook" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a className="social-icon text-xs-center" target="_blank" href="">
                                <i className="fa fa-twitter" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a className="social-icon text-xs-center" target="_blank" href="">
                                <i className="fa fa-skype" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a className="social-icon text-xs-center" target="_blank" href="">
                                <i className="fa fa-google" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)
            })}
          </div>
        </div>
      </section>)
    }
    else if (this.state.restApiError)
    {
      return(
      <Provider theme={themes.teams} > 
<ErrorMessage/>
    </Provider>
      )
    }
    else {
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