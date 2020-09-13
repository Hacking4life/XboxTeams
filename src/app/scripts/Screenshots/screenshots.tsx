import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
const axios = require('axios');
import * as https from "https";
import * as querystring from "querystring";
import "../../web/styles/loader.css";
const queryString = require('query-string');
import {Share} from "../ShareButton/Share";
import { Provider, themes} from "@fluentui/react-northstar";
import {ErrorMessage} from "../ErrorMessage/error";

export interface IScreenshotState extends ITeamsBaseComponentState {
  Screenshots: Array<any>
  dataloaded:boolean,
  restApiError:boolean
}

export interface IScreenshotProps {

}

export interface ScreenshotProp {
}

export class screenshots extends TeamsBaseComponent<IScreenshotProps, IScreenshotState> {

  public getScreenshots(token: AuthToken) {

    if (token != null || typeof (token) != "undefined") {
      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken
      });
      const options = {
        path: "https://xboxliveauthenticatorservice.azurewebsites.net/screenshots",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      let screenshots_json=""; 
    let ctx=this;
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on("data" , function (chunk) {
          screenshots_json += chunk;
        });
        res.on("end",  function () {
          try {
            const screeshots = JSON.parse(screenshots_json.toString());
            ctx.setState({
              Screenshots: screeshots.screenshots,
              dataloaded:true,
              restApiError:false
            })
          }
          catch
          {
            ctx.setState({
              dataloaded: false,
              restApiError:true
            })
          }
        });
      });
      req.on("error", (e) => {
        console.error(e);
        ctx.setState({
          dataloaded: false,
          restApiError:true
        });
      });
      req.write(postData);
      req.end();
    }
  }
  public componentWillMount() {
    this.setState({ Screenshots: [] ,dataloaded:false, restApiError:false});

  }
  public async componentDidMount() {
    const token : AuthToken= queryString.parse(location.search);
    var context = this;
    this.getScreenshots(token);
  }


  public activeItem() {
    if (this.state.Screenshots.length != 0) {
      return (
        <div className="active item" data-slide-number={0}>
          <img src={this.state.Screenshots[0].thumbnails[1].uri} />
        </div>)
    }
  }
  public render() {
    if (this.state.dataloaded && !this.state.restApiError) 
    {
     return (
      <div className="container">
        <div id="main_area">
          {/* Slider */}
          <div className="row">
            <div className="span12" id="slider">
              {/* Top part of the slider */}
              <div className="row">
                <div className="span8" id="carousel-bounding-box">
                  <div className="carousel slide" id="myCarousel">
                    {/* Carousel items */}
                    <div className="carousel-inner">
                      {this.activeItem()}
                      {this.state.Screenshots.map((value, index) => {
                        if (index != 0) {
                          return (
                            <div className="item" data-slide-number={index}>
                              <img src={this.state.Screenshots[index].thumbnails[1].uri} />
                            </div>);
                        }
                      })}
                    </div>
                    <a className="carousel-control left" data-slide="prev" href="#myCarousel">‹</a> <a className="carousel-control right" data-slide="next" href="#myCarousel">›</a>
                  </div>
                </div>
                <div className="span4" id="carousel-text" />
                <div id="slide-content" style={{ display: 'none' }}>
                  {this.state.Screenshots.map((value, index) => {
                    return (
                      <div id={"slide-content-" + index}>
                        <h2>{this.state.Screenshots[index].titleName}</h2>
                        <p />
                        <p className="sub-text"><strong>Rating: </strong>{this.state.Screenshots[index].rating}</p>
                        <p className="sub-text"><strong>Views: </strong>{this.state.Screenshots[index].views}</p>
                        <p className="sub-text"><strong>Date Taken: </strong>{this.state.Screenshots[index].dateTaken}</p>
                        <p className="sub-text">Click here to <a href={this.state.Screenshots[index].screenshotUris[0].uri}> Download</a></p>
                    
                      </div>);
                  })}
                </div>
              </div>
            </div>
          </div>{/*/Slider*/}
          <div className="row hidden-phone" id="slider-thumbs">
            <div className="span12">
              {/* Bottom switcher of slider */}
              <ul className="thumbnails">
                {this.state.Screenshots.map((value, index) => {
                  return (
                    <li className="span2">
                      <a className="thumbnail" id={"carousel-selector-" + index}><img src={this.state.Screenshots[index].thumbnails[0].uri} /></a>
                    </li>)
                })}
              </ul>
            </div>
          </div>
        </div>
        <Share invoke={{type:'screenshots'}}></Share>
      </div>
    )
              }else if (this.state.restApiError)
              {
                return(
                <Provider theme={themes.teams} styles={{ backgroundColor: "cadetblue" }} > 
          <ErrorMessage/>
              </Provider>
                )
              }
              else if(!this.state.dataloaded)
              {
                return(
                
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
