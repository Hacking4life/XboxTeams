import * as React from "react";
import '../../web/styles/club.css';
import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { UserAgentApplication } from "msal";
import * as Msal from 'msal';
const axios = require('axios');
import { ClubForm } from "../Clubs/clubform"
import "bootstrap"




// https://codepen.io/tbleckert/pen/CkufH
interface MyState {
  teamID: any
  tenantId: any,
  currentUser: any
}
declare var MicrosoftGraph: any

export class ClubS extends React.Component<{}, MyState> {
  constructor(props) {
    super(props);


  }

  componentWillMount() {
    var context = this;
    microsoftTeams.initialize();

    microsoftTeams.getContext(function (teamsctx) {
      context.setState({ teamID: teamsctx.groupId, tenantId: teamsctx.tid, currentUser: teamsctx.userPrincipalName })
      axios.all([context.createClub(context)]).then(axios.spread(function (acct) {
      }));
    });


  }

  public createClub(context) {
  }
  render() {

    return (

      <div>
        <div className="modal fade" id="modalLoginForm" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title w-100 font-weight-bold" style={{ color: 'black' }}>Club</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body mx-3">
                <div className="md-form mb-5">
                  <i className="fas fa-envelope prefix grey-text" />
                  <input type="email" id="defaultForm-email" className="form-control validate" />
                  <label data-error="wrong" data-success="right" style={{ color: 'black' }} htmlFor="defaultForm-email">Enter your club Name</label>
                </div>
                <div className="md-form mb-4">
                  <i className="fas fa-lock prefix grey-text" />
                  <textarea id="defaultForm-pass" className="form-control validate" />
                  <label data-error="wrong" data-success="right" style={{ color: 'black' }} htmlFor="defaultForm-pass">Description</label>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button data-dismiss="modal" className="btn btn-default" style={{ color: 'black' }} >Create</button>
              </div>
            </div>
          </div>
        </div>
        <h2><strong>Game clubs<span></span></strong></h2> <div style={{ alignContent: 'center' }}
        ><h2 className="btn btn-default btn-rounded mb-4" style={{ fontSize: 'inherit' }} data-toggle="modal" data-target="#modalLoginForm">Create Your personal Club</h2></div>
        <div>
          {/* Hello world */}
          <section className="shelf">
            <div>
              <article className="bluray case">
                <div>

                  <div className="img">
                    <span><img src="https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Finsertcoin%2Ffiles%2F2015%2F06%2Farkham-knight3.jpg" /></span>
                  </div>
                </div>
              </article>
              {/* Playstation 3 case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://media.playstation.com/is/image/SCEA/red-dead-redemption-2-rdo-key-art-desktop-02-ps4-us-14may19?$native_nt$" /></span>
                  </div>
                </div>
              </article>
              {/* Xbox 360 case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://seeklogo.com/images/F/fortnite-logo-4D53F6E8F3-seeklogo.com.png" /></span>
                  </div>
                </div>
              </article>
              {/* CD case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://logos-world.net/wp-content/uploads/2020/04/Minecraft-Logo-2011-2015.png" /></span>
                  </div>
                </div>
              </article>
            </div>
          </section>
          <section className="shelf">
            <div>
              {/* Blu ray case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://img.freepik.com/free-vector/coming-soon-message-illuminated-with-light-projector_1284-3622.jpg?size=338&ext=jpg" /></span></div>
                </div>
              </article>
              {/* Playstation 3 case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://img.freepik.com/free-vector/coming-soon-message-illuminated-with-light-projector_1284-3622.jpg?size=338&ext=jpg" /></span>
                  </div>
                </div>
              </article>
              {/* Xbox 360 case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://img.freepik.com/free-vector/coming-soon-message-illuminated-with-light-projector_1284-3622.jpg?size=338&ext=jpg" /></span>
                  </div>
                </div>
              </article>
              {/* CD case preview */}
              <article className="ps3 case">
                <div>
                  <div className="img">
                    <span><img src="https://img.freepik.com/free-vector/coming-soon-message-illuminated-with-light-projector_1284-3622.jpg?size=338&ext=jpg" /></span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
        <h2><strong>Upcoming Multiplayer sessions</strong></h2>
        <div className="news">
          <figure className="article">
            <img src="https://mrreiha.keybase.pub/codepen/hover-fx/news1.jpg" />
            <figcaption>
              <h3>Fotnite</h3>
              <p>
                A Multiplayer session is created for this game at 5.00 PM and still has 2 open slots
                    </p>
            </figcaption>
          </figure>
          <figure className="article">
            <img src="https://mrreiha.keybase.pub/codepen/hover-fx/news2.png" />
            <figcaption>
              <h3>Read Dead Online</h3>
              <p>
                One player is looking for players to join his quest..
                    </p>
            </figcaption>
          </figure>
        </div>
        <div style={{ alignContent: 'center' }}
        ><h2 className="btn btn-default btn-rounded mb-4" style={{ fontSize: 'inherit' }} data-toggle="modal" data-target="#modalLoginForm">Create Your Event</h2></div>
      </div>

    );
  }
}



