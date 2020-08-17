import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
const queryString = require('query-string');

export interface IFamilyState extends ITeamsBaseComponentState {
  FamilyUsers: Array<any>
  dataloaded: boolean
}

export interface IFamilyProps {
}

export interface FamilycardProp {
}
export class family extends TeamsBaseComponent<IFamilyProps, IFamilyState> {

  public getMembers(token: AuthToken) {
    if (token != null && typeof (token) != "undefined") {
      return axios({
        method: 'get',
        baseURL: 'https://cors-anywhere.herokuapp.com/https://accounts.xboxlive.com/',   /// will be removed once ajits node package is available
        url: `/family/memberXuid(${token.userXUID})`,
        headers: {
          'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
          timeout: 1000
        }
      })
    }
  }

  public async componentWillMount() {
    this.setState({ FamilyUsers: [], dataloaded: false })
    const token: AuthToken = queryString.parse(location.search);
    // var authService = new AuthenticationService();
    // // var token: AuthToken = authService.GetTokenFromFile();
    // let token: AuthToken = await authService.getUserToken("arunjb2016@gmail.com", "Clannad@01");
    var context = this;
    axios.all([this.getMembers(token)]).then(axios.spread(function (family) {
      context.setState({
        FamilyUsers: family.data.familyUsers,
        dataloaded: true
      })
    }))
  }

  public render() {
    if (this.state.dataloaded) {
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