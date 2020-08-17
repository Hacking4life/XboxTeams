
import * as React from "react";
import "../../web/styles/Connect.css"
import * as querystring from "querystring";
import * as https from "https";
import "bootstrap"
export interface IConnectState {
  modalOpened: boolean
  consoleFound: boolean
  Ip: string
  Device: string
  ModalHeading: string
  ModalBody: string
}

export class Modal extends React.Component<{}, IConnectState> {
  constructor(props) {
    super(props)
    // this.setState({
    //     modalOpened:false
    // })   
    this.state = {
      modalOpened: false,
      consoleFound: true,
      Ip: "192.1.0.8",
      Device: "XBOXONE",
      ModalHeading: "",
      ModalBody: ""

    }
    this.modalToggle = this.modalToggle.bind(this)
    // this.render=this.render.bind(this);
    this.connect = this.connect.bind(this);
  }

  modalToggle() {
    this.setState({ modalOpened: !this.state.modalOpened })
  }

  public turnoff(ip) {
    const postData = querystring.stringify({
      ip: ip
    });
    const options = {
      path: "http://localhost:3001/turnoff",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    const req = https.request(options, (res) => {
      this.setState({
        consoleFound: false,
        modalOpened: true,
        ModalHeading: "Console Turned OFF",
        ModalBody: `The device ${this.state.Device} has been turned off . To connect again Switch on your console manually.`
      })
    });
    req.on("error", (e) => {
      this.setState({
        modalOpened: true,
        consoleFound: false,
        ModalHeading: "Something went wrong",
        ModalBody: `Error : ${e.message} ,  ${e.stack}`

      })
      console.error(e);
    });
    req.write(postData);
    req.end();
  }
  public connect(ip?: string) {
    if (ip == null || typeof (ip) == "undefined") {
      ip = "";
    }
    const postData = querystring.stringify({
      ip: ip
    });
    const options = {
      path: "http://localhost:3001/connect",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        var result;
        try {
          result = JSON.parse(new TextDecoder("utf-8").decode(d));
        }
        catch {
          result = new TextDecoder("utf-8").decode(d);
        }
        console.log(result);
        if (result != "NO") {
          this.setState({
            modalOpened: true,
            consoleFound: true,
            Device: result.Device,
            Ip: result.IP,
            ModalBody: `Device ${result.Device} has been successfully connected to the remote application through ${result.IP}.`,
            ModalHeading: "Connection Successfull !"
          })
        }
        else {
          this.setState({
            modalOpened: true,
            consoleFound: false,
            ModalBody: "Cannot find a XBOX one to connect to. Is your console ON and connected to the same network?",
            ModalHeading: "No Xbox Devices Found"

          })
        }
      });
    });
    req.on("error", (e) => {
      this.setState({
        modalOpened: true,
        consoleFound: false,
        ModalHeading: "Something went wrong",
        ModalBody: `Error : ${e.message} ,  ${e.stack}`

      })
      console.error(e);
    });
    req.write(postData);
    req.end();
  }

  public sendbutton(ip, button) {

  }

  public screenDvr(ip)
  {
    this.setState({
      modalOpened: true,
      consoleFound: true,
      ModalHeading: "Recording......",
      ModalBody: `Game dvr is getting recorded , uploading the clip to Live server will happen once recording is finished`

    })
  }

  public remotetv(ip)
  {
    this.setState({
      modalOpened: true,
      consoleFound: true,
      ModalHeading: "XBOX TV",
      ModalBody: `Remote tv feature activated on ${this.state.Device} , use the cursors to change your channel or adjust your volume`

    })

  }

  render() {
    const coverClass = this.state.modalOpened ? 'modal-cover modal-cover-active' : 'modal-cover'
    const containerClass = this.state.modalOpened ? 'modal-container modal-container-active' : 'modal-container'
    const header = this.state.ModalHeading
    const body = this.state.ModalBody
    const connecetdclass = this.state.consoleFound ? 'enableLink' : 'disabelLink'
    return (
      <div className="options">
        <div className="option01">
          <a href="#" onClick={() => { this.connect() }} >
            <p>Connect to console</p>
            <i className="fa fa-arrow-right" />
          </a>
          <div className={containerClass}>
            <h1 className="modalheader">{header}</h1>
            <br></br><br></br><br></br>
            <h3 className="modalmessage">{body}</h3>
          </div>
          <div className={coverClass} onClick={this.modalToggle}></div>
        </div>
        <div className="option02">
          <a className={connecetdclass} onClick={() => { this.screenDvr(this.state.Ip) }}>
            <p>Record the Screen</p>
            <i className="fa fa-battery-three-quarters" />
          </a>
        </div>
        <div className="option03">
          <a className={connecetdclass} href="#" onClick={() => { this.remotetv(this.state.Ip) }}>
            <p>Activate Remote TV</p>
            <i className="fa fa-clock-o" />
          </a>
        </div>
        <div className="option04">
          <a className={connecetdclass} onClick={() => { this.turnoff(this.state.Ip) }}>
            <p>Turn Off</p>
            <i className="fa fa-power-off" />
          </a>
        </div>
      </div>

    )

  }
}
