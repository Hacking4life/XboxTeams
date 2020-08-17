import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Leaderboard } from "../Leaderboard/leaderboard"
import { ClubS } from "../Clubs/Clubs"
import {Friends} from "../Friends/Friends"
import { AuthToken } from "../Utilities/Model/AuthToken"

// https://codepen.io/NateGriffin/pen/nkJjr
// https://codepen.io/yananym/pen/EBagr
export default class Tab extends React.Component<{username:string,password:string,token:AuthToken}, {}>
{

  public submit(type): any {
    let taskInfo: any = {
      title: null,
      height: null,
      width: null,
      url: null,
      card: null,
      fallbackUrl: null,
      completionBotId: null,
    };
    const host = "https://" + window.location.host;
    if (type.includes('adaptivecard')) {
      taskInfo.url = host + `/userprofiletab/gamercard.html?userHash=${this.props.token.userHash}&userXUID=${this.props.token.userXUID}&XSTSToken=${this.props.token.XSTSToken}`;
      taskInfo.title = "Xbox Live Profile";
      taskInfo.height = "530";
      taskInfo.width = "1000";
    }
    else if (type.includes('acheivements')) {
      taskInfo.url = host + `/userprofiletab/Achievements.html?userHash=${this.props.token.userHash}&userXUID=${this.props.token.userXUID}&XSTSToken=${this.props.token.XSTSToken}`;
      taskInfo.title = "Recent Acheivements";
      taskInfo.height = "530";
      taskInfo.width = "1000";
    }
    else if (type.includes('family')) {
      taskInfo.url = host + `/userprofiletab/Family.html?userHash=${this.props.token.userHash}&userXUID=${this.props.token.userXUID}&XSTSToken=${this.props.token.XSTSToken}`;
      taskInfo.title = "My Family";
      taskInfo.height = "630";
      taskInfo.width = "1300";
    }
    else if (type.includes('screenshots')) {
      taskInfo.url = host + `/userprofiletab/ScreenShots.html?userHash=${this.props.token.userHash}&userXUID=${this.props.token.userXUID}&XSTSToken=${this.props.token.XSTSToken}`;
      taskInfo.title = "Screenshots";
      taskInfo.height = "600";
      taskInfo.width = "1400";
    }
    else if (type.includes('video')) {
      taskInfo.url = host + `/userprofiletab/gameclips.html?userHash=${this.props.token.userHash}&userXUID=${this.props.token.userXUID}&XSTSToken=${this.props.token.XSTSToken}`;
      taskInfo.title = "Recent Game Clips";
      taskInfo.height = "800";
      taskInfo.width = "2000";
    }
    else if (type.includes('gt')) {
      taskInfo.url = host + "/userprofiletab/gamertag.html";
      taskInfo.title = "Recent Game Clips";
      taskInfo.height = "530";
      taskInfo.width = "1000";
    }
    taskInfo.fallbackUrl = taskInfo.url;

    if (type.includes('bot'))
      taskInfo.completionBotId = "52531e3f-19dc-4514-ba3a-44646eafa52c";
    microsoftTeams.tasks.startTask(taskInfo, this.submitHandler);
  }

  public submitHandler = (err, result) => {
    console.log(`Submit handler - err: ${err}`);
  };


  public render() {
    return (
      <section id="tabs" style={{ overflow: 'auto' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 ">
              <nav>
                <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                  <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Profile</a>
                  <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Friends</a>
                  <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Clubs</a>
                  <a className="nav-item nav-link" id="nav-about-tab" data-toggle="tab" href="#nav-about" role="tab" aria-controls="nav-about" aria-selected="false">Leaderborad</a>
                </div>
              </nav>
              <div className="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                  <div className="box">
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <div className="title">
                              <h4>Gamer Card</h4>
                            </div>
                            <div className="text">
                              <span>View and share your Gamer card</span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" onClick={() => { this.submit('adaptivecard') }}>Gamer Card</button>
                              <p />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <div className="title">
                              <h4>Change your Gamer Tag</h4>
                            </div>
                            <div className="text">
                              <span>Change your gamer tag</span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" >Change GamerTag</button>
                              <p />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <i className="fa fa-google-plus fa-3x" aria-hidden="true" />
                            <div className="title">
                              <h4>Xbox Family</h4>
                            </div>
                            <div className="text">
                              <span>View your Xbox Family member settings</span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" onClick={() => { this.submit('family') }}>Show</button>
                              <p />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <div className="title">
                              <h4>Recent Acheivements</h4>
                            </div>
                            <div className="text">
                              <span>View and share your  recent Game acheivements</span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" onClick={() => { this.submit('acheivements') }}>Recent Acheivements</button>
                              <p />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <div className="title">
                              <h4>Recent Screenshots</h4>
                            </div>
                            <div className="text">
                              <span>View and share your recent screenshots with the team </span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" onClick={() => { this.submit('screenshots') }}>Recent Screenshots</button>
                              <p />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                          <div className="box-part text-center">
                            <i className="fa fa-pinterest-p fa-3x" aria-hidden="true" />
                            <div className="title">
                              <h4>Game Clips</h4>
                            </div>
                            <div className="text">
                              <span>View and share your recent saved  game Clips</span>
                            </div>
                            <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                              <button className="btn btn-primary" onClick={() => { this.submit('video') }}>Recent Game Clips</button>
                              <p />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ visibility: 'hidden' }}>Et et consectetur ipsum labore excepteur est proident excepteur ad velit occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat. Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit. Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore. Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.</p>
                </div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                  <Friends username={this.props.username} password={this.props.password}></Friends>
                  <p style={{ visibility: 'hidden' }}>Et et consectetur ipsum labore excepteur est proident excepteur ad velit occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat. Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit. Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore. Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.</p>
                </div>
                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                  <ClubS></ClubS>
                  <p style={{ visibility: 'hidden' }}> Et et consectetssssur ipsum labore excepteur est proident excepteur ad velit occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat. Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit. Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore. Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.</p>
                </div>
                <div className="tab-pane fade" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                  <Leaderboard username={this.props.username} password={this.props.password}></Leaderboard>
                  <p style={{ visibility: 'hidden' }}>Et et consectetur ipsum labore excepteur est proident excepteur ad velit occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat. Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit. Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore. Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>)

  }
  // https://codepen.io/derekmorash/pen/NjBvdX

}