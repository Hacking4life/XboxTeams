import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
import * as https from "https";
import * as querystring from "querystring";
import "../../web/styles/loader.css";
const queryString = require('query-string');

export interface IGameClipstate extends ITeamsBaseComponentState {
  gameClips: Array<any>
  dataloaded: boolean

}

export interface IGameClipProps {

}

export interface GameClipProp {
}

export class gameClips extends TeamsBaseComponent<IGameClipProps, IGameClipstate> {
  public getgameClips(token: AuthToken) {
    if (token != null || typeof (token) != "undefined") {
      const postData = querystring.stringify({
        xuid: token.userXUID,
        uhash: token.userHash,
        token: token.XSTSToken
      });
      const options = {
        path: "https://xboxliveauthenticatorservice.azurewebsites.net/gameclips",
        //  path: "http://localhost:3001/gameclips",
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
            console.log(d.toString('utf8'));
            const clips: any = JSON.parse(d.toString('utf8'));
            // const clips: any = d;
            context.setState({
              gameClips: clips.gameClips,
              dataloaded: true
            })
          }
          catch (ex) {
            console.log(ex)
            // window.location.reload(false);
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
    this.setState({ gameClips: [], dataloaded: false });
  }

  public async componentDidMount() {
    const token: AuthToken = queryString.parse(location.search);
    //  var authService = new AuthenticationService();
    // let token: AuthToken = await authService.getUserToken("arunjb2016@gmail.com", "Clannad@01");
    var context = this;
    this.getgameClips(token);
  }

  public activeItem() {
    if (this.state.gameClips.length != 0) {
      return (
        <div className="item active">
          {/* Button inside item so it slides with the carousel */}
          <div className="inner-content">
            <video width={700} height={400} controls>
              <source src={this.state.gameClips[0].gameClipUris[0].uri} type="video/mp4" />
            </video>
          </div>
        </div>
      )
    }
  }

  public render() {
    if (this.state.dataloaded) {
      return (
        // <div>asdasdasdasasd</div>
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
                              <video width={700} height={400} controls>
                                <source src={this.state.gameClips[index].gameClipUris[0].uri} type="video/mp4" />
                              </video>
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
          </div>
        </section>
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