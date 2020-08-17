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
    console.log("yes");
    microsoftTeams.initialize();

    microsoftTeams.getContext(function (teamsctx) {
      console.log(teamsctx);
      context.setState({ teamID: teamsctx.groupId, tenantId: teamsctx.tid, currentUser: teamsctx.userPrincipalName })
      axios.all([context.createClub(context)]).then(axios.spread(function (acct) {
        console.log(acct);
      }));
    });


  }

  public createClub(context) {
    // return  axios({
    //     method: 'post',
    //     baseURL: 'https://login.microsoftonline.com/',   /// will be removed once ajits node package is available
    //     url: `${context.state.tenantId}/oauth2/v2.0/token/client_id=19dd7860-b66e-43f4-a71a-81c0dd23a8bd
    //     &scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
    //     &client_secret=iafQjr2Y~6Km~Qzf6al.2kfpn__1o5TK_1
    //     &grant_type=client_credentials`,
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     }
    // })

  }






  //     const msalConfig = {
  //       auth: {
  //           clientId: "19dd7860-b66e-43f4-a71a-81c0dd23a8bd", // Client Id of the registered application
  //           redirectUri: "https://8dd654fbe7ad.ngrok.io/userprofiletab/",
  //       },
  //   };
  //   const graphScopes = ["Group.ReadWrite.All", "mail.send"]; // An array of graph scopes



  //   // Important Note: This library implements loginPopup and acquireTokenPopup flow, remember this while initializing the msal
  //   // Initialize the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js#1-instantiate-the-useragentapplication
  //   const msalApplication = new UserAgentApplication(msalConfig);
  //   const options = new MicrosoftGraph.MSALAuthenticationProviderOptions(graphScopes);
  //   const authProvider = new ImplicitMSALAuthenticationProvider(msalApplication, options);
  //   const option = {
  //     authProvider, 
  // };
  // const client = Client.initWithMiddleware(option);
  // const channel = {
  //   displayName: "Architecture Discussion",
  //   description: "This channel is where we debate all future architecture plans"
  // };
  // try {
  //   let userDetails = await client.api(`/teams/${this.state.teamID}/channels`).post(channel)
  //   console.log(userDetails);
  // } catch (error) {
  //   console.log(error)
  // }


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
        {/* <div className="cards">
                <figure className="card">
                  <img src="https://media.playstation.com/is/image/SCEA/red-dead-redemption-2-rdo-key-art-desktop-02-ps4-us-14may19?$native_nt$" />
                  <figcaption>Read Dead Redemptio 2</figcaption>
                </figure>
                <figure className="card">
                  <img src="https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Finsertcoin%2Ffiles%2F2015%2F06%2Farkham-knight3.jpg" />
                  <figcaption>Batman Arkham Knight</figcaption>
                </figure>
                <figure className="card">
                  <img src="https://seeklogo.com/images/F/fortnite-logo-4D53F6E8F3-seeklogo.com.png" />
                  <figcaption>FortNite</figcaption>
                </figure>
                <figure className="card">
                  <img src="https://lh3.googleusercontent.com/yAtZnNL-9Eb5VYSsCaOC7KAsOVIJcY8mpKa0MoF-0HCL6b0OrFcBizURHywpuip-D6Y" />
                  <figcaption>MineCraft</figcaption>
                </figure>
              </div> */}
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



