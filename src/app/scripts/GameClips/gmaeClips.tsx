import * as React from "react";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
import * as https from "https";
import * as querystring from "querystring";
import "../../web/styles/loader.css";
const queryString = require('query-string');
import { Share } from "../ShareButton/Share";
import { Video,Provider, themes, Alert, Flex  } from "@fluentui/react-northstar";
import {ErrorMessage} from "../ErrorMessage/error";

export interface IGameClipstate extends ITeamsBaseComponentState {
  gameClips: Array<any>
  dataloaded: boolean
  restApiError:boolean

}

export interface IGameClipProps {

}

export interface IGameClipProp {
}

export class gameClips extends TeamsBaseComponent<IGameClipProps, IGameClipstate> {

  constructor(props)
  {
    super(props);
    this.getgameClips.bind(this);
  }
  public getgameClips(token: AuthToken) {
    if (token != null || typeof (token) != "undefined") {
      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken
      });
      const options = {
        path: "https://xboxliveauthenticatorservice.azurewebsites.net/gameclips",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      };
      let clips_json=""; 
      let context=this;
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on("data" , function (chunk) {
          clips_json += chunk;
        });
        res.on("end",  function () {
          try {
          const clips: any = JSON.parse(clips_json.toString());
          context.setState({
              gameClips: clips.gameClips,
              dataloaded: true,
              restApiError:false
            });
          }
          catch (ex){
            console.log(ex);
            context.setState({
              restApiError: true
            })
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
    this.setState({ gameClips: [], dataloaded: false ,restApiError:false});
  }

  public async componentDidMount() {
    const token: AuthToken = queryString.parse(location.search);
    let context = this;
    this.getgameClips(token);
  }

  public activeItem() {
    if (this.state.gameClips.length != 0) {
      return (
        <div className="item active">
          {/* Button inside item so it slides with the carousel */}
          <div className="inner-content">
            <Video
              autoPlay
              muted
              src={this.state.gameClips[0].gameClipUris[0].uri}
              variables={{
                width: '550px',
                height: '400px'
              }} />
          </div>
        </div>
      )
    }
  }
  public render() {
    if (this.state.dataloaded && !this.state.restApiError) {

      return (
        //    <Provider theme={themes.teams} >
        //   <Flex  style={{backgroundColor:"darkgray"}}  >
        //   <Video
        //     autoPlay
        //     muted
        //     src="https://gameclipscontent-d3017.xboxlive.com/xuid-2535469913557889-private/881b0433-fbf4-4f9f-b0f9-1f8548581b2f.MP4"
        //     variables={{
        //       width: '720px',
        //       height:'500px'
        //     }}
        //   />
        // </Flex>
        //  </Provider>
        <Provider theme={themes.teams} styles={{ backgroundColor: "darkgray" }} >
          <section>
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6 col-sm-offset-3 text-center" >
                  <div id="video-carousel" className="carousel slide" >
                    {/* Indicators */}
                    <ol className="carousel-indicators">
                      <li data-target="#video-carousel" data-slide-to="0" className="active" />
                      {this.state.gameClips.map((value, index) => {
                        if (index !== 0) {
                          return (<li data-target="#video-carousel" data-slide-to={index} />)
                        }
                      })};
                </ol>
                    <div className="carousel-inner" role="listbox">
                      {this.activeItem()}
                      {this.state.gameClips.map((value, index) => {
                        if (index !== 0) {
                          return (
                            <div className="item">
                              {/* Button inside item so it slides with the carousel */}
                              <div className="inner-content">
                                <Video
                                  autoPlay
                                  muted
                                  src={this.state.gameClips[index].gameClipUris[0].uri}
                                  variables={{
                                    width: '550px',
                                    height: '400px'
                                  }}>
                                </Video>
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                    {/* Controls */}
                    <a className="left carousel-control" href="#video-carousel" role="button" data-slide="prev">
                      <i className="fa fa-chevron-left" aria-hidden="true" />
                      <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#video-carousel" role="button" data-slide="next">
                      <i className="fa fa-chevron-right" aria-hidden="true" />
                      <span className="sr-only">Next</span>
                    </a>
                  </div>
                </div>
              </div>
              <Share invoke={{ type: 'clip', url: this.state.gameClips[0].gameClipUris[0].uri }}></Share>
            </div>
          </section>
        </Provider>
      )
    }
    else if (this.state.restApiError)
    {
      return(
      <Provider theme={themes.teams} styles={{ backgroundColor: "darkgray" }} >
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
