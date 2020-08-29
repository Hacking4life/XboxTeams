import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
var $ = require("jquery");
import 'bootstrap';
import "../../web/styles/loader.css"
import {Share} from "../ShareButton/Share"
const queryString = require('query-string');

export interface IAchievementState extends ITeamsBaseComponentState {
  Achievements: Array<any>
  dataloaded: boolean
}

export interface IAchievementProps {

}

export interface AchievementProp {
}

export class achievements extends TeamsBaseComponent<IAchievementProps, IAchievementState> {

  public getAchievements(token: AuthToken) {
    return axios({
      method: 'get',
      baseURL: 'https://cors-anywhere.herokuapp.com/https://achievements.xboxlive.com/',   /// will be removed once ajits node package is available
      url: `/users/xuid(${token.userXUID})/achievements?unlockedOnly=true&orderBy=UnlockTime`,
      headers: {
        'x-xbl-contract-version': '2', 'Authorization': `XBL3.0 x=${token.userHash};${token.XSTSToken}`,
        timeout: 1000
      }
    })
  }

  public async componentWillMount() {
    this.setState({ Achievements: [], dataloaded: false });
    const token: AuthToken = queryString.parse(location.search);
    // var authService = new AuthenticationService();
    // let token: AuthToken = await authService.getUserToken("arunjb2016@gmail.com", "Clannad@01");
    var context = this;
    axios.all([this.getAchievements(token)]).then(axios.spread(function (achv) {

      context.setState({
        Achievements: achv.data.achievements,
        dataloaded: true
      })
    }))
  }

  public activeItem() {
    if (this.state.Achievements.length != 0) {
      return (<div className="item active">
        <div className="col-xs-4">
          <a href="#1"><img src={this.state.Achievements[0].mediaAssets[0].url} className="img-responsive" />
            <p /><p />
            <h4 style={{ textAlign: 'center' }}>{this.state.Achievements[0].titleAssociations[0]['name']}</h4>
            <p />
            <h5 style={{ textAlign: 'center' }}>{this.state.Achievements[0].description}</h5>
          </a></div>
      </div>)
    }
  }
  public render() {
    if (this.state.dataloaded) {
      return (
        <div className="container">
          <h1 style={{ textAlign: 'center' }}>Recent Acheivements</h1><br /><br />
          <p />
          <p />
          <div className="row">
            <div className="col-md-12">
              <div className="carousel slide multi-item-carousel" id="theCarousel">
                <div className="carousel-inner">
                  {this.activeItem()}
                  {this.state.Achievements.map((value, index) => {
                    return (<div className="item">
                      <div className="col-xs-4">
                        <a href="#1"><img src={this.state.Achievements[index].mediaAssets[0].url} className="img-responsive" /></a>
                        <p /><p />
                        <h4 style={{ textAlign: 'center' }}>{this.state.Achievements[index].titleAssociations[0]['name']}</h4>
                        <p />
                        <h5 style={{ textAlign: 'center' }}>{this.state.Achievements[index].description}</h5>
                      </div>
                    </div>)
                  })}
                </div>
                <a className="left carousel-control" href="#theCarousel" data-slide="prev"><i className="glyphicon glyphicon-chevron-left" /></a>
                <a className="right carousel-control" href="#theCarousel" data-slide="next"><i className="glyphicon glyphicon-chevron-right" /></a>
              </div>
            </div>
          </div>
          <Share invoke={{type:'achv'}}></Share>
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

  public componentDidUpdate() {

    $('.multi-item-carousel').carousel({
      interval: false
    });
    $('.multi-item-carousel .item').each(function () {
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      if (next.next().length > 0) {
        next.next().children(':first-child').clone().appendTo($(this));
      } else {
        $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
      }
    });

  }
}