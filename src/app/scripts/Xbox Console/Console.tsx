// https://codepen.io/ellie_html/pen/QWjyPWQ
// https://codepen.io/emozlove/pen/LOwGZz
// https://codepen.io/internette/pen/VLGmJm


import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../../web/styles/SmartGlass.css"
import * as querystring from "querystring";
import * as https from "https";
import { json } from "express";
import { Modal } from '../Xbox Console/Connect';

/**
 * State for the SmartGlassTab React component
 */
export interface ISmartGlassState extends ITeamsBaseComponentState {
  toggle: boolean
  isModalOpen: boolean
  consoleFound: boolean
}

export interface ISmartGlassProps {
}
export class SmartGlass extends TeamsBaseComponent<ISmartGlassProps, ISmartGlassState> {
  constructor(props) {
    super(props);
    this.setState({ isModalOpen: false })
    this.connect = this.connect.bind(this);
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
        var result = new TextDecoder("utf-8").decode(d);
        if (result != "N0") {
          this.setState({
            isModalOpen: true,
            consoleFound: true
          })
        }
        else {
          this.setState({
            isModalOpen: true,
            consoleFound: false
          })
        }
      });
    });
    req.on("error", (e) => {
      this.setState({
        isModalOpen: true,
        consoleFound: false
      })
      console.error(e);
    });
    req.write(postData);
    req.end();
  }


  componentWillMount() {
    //this.connect()
  }

  public closeModal(): any {
    this.setState({ isModalOpen: false })
  }

  public sendbutton(ip, button) {
    const postData = querystring.stringify({
      ip: ip,
      button: button
    });
    const options = {
      path: "http://localhost:3001/buttonpress",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    const req = https.request(options, (res) => {
    });
    req.on("error", (e) => {
      console.error(e);
    });
    req.write(postData);
    req.end();
  }

  public render() {


    return (
      <div>
        <div className="xbox-system">
          <div className="system">
            <h1>troubleshoot</h1>
            <Modal></Modal>
            <p>Make sure that the console is On and connected to the Same VPN to initiate a proper connection</p>
          </div>
        </div>
        <div className="structure">
          <div className="shadows">
            <div className="shadow-top" />
            <div className="shadow-right" />
            <div className="shadow-left" />
          </div>
          <div className="base" />
          <div className="side-top" />
          <div className="side-bottom" />
          <div className="side-right" />
          <div className="side-left" />
          <div className="arm-right">
            <div className="circle01" />
            <div className="circle02" />
            <div className="circle03" />
            <div className="circle04" />
            <div className="circle05" />
          </div>
          <div className="arm-left-top">
            <div className="circle06" />
            <div className="circle07" />
            <div className="circle08" />
            <div className="circle09" />
            <div className="circle10" />
          </div>
          <div className="arrows">
            <div className="arrow-top-bottom" onClick={() => { this.sendbutton("192.168.0.8", 'down') }} />
            <div className="arrow-top-bottom2" onClick={() => { this.sendbutton("192.168.0.8", 'up') }} />
            <div className="arrow-right-left" onClick={() => { this.sendbutton("192.168.0.8", 'left') }} />
            <div className="arrow-right-left2" onClick={() => { this.sendbutton("192.168.0.8", 'right') }} />
            <div className="hide" />
          </div>
          <div className="buttons">
            <div className="button-top">
              <p style={{paddingTop: '30px'}}    onClick={() => { this.sendbutton("192.168.0.8", 'y') }}>y</p>
              <div className="shadow" />
            </div>
            <div className="button-right">
              <p style={{paddingTop: '30px'}} onClick={() => { this.sendbutton("192.168.0.8", 'b') }}>b</p>
              <div className="shadow" />
            </div>
            <div className="button-bottom">
              <p style={{paddingTop: '30px'}} onClick={() => { this.sendbutton("192.168.0.8", 'a') }}>a</p>
              <div className="shadow" />
            </div>
            <div className="button-left">
              <p style={{paddingTop: '30px'}} onClick={() => { this.sendbutton("192.168.0.8", 'x') }}>x</p>
              <div className="shadow" />
            </div>
          </div>
          <div className="extra-buttons">
            <div className="button-menu" onClick={() => { this.sendbutton("192.168.0.8", 'nexus') }}>
              <i className="fa fa-bars" />
            </div>
            <div className="button-link" onClick={() => { this.sendbutton("192.168.0.8", 'view') }}>
              <i className="fa fa-external-link" />
            </div>
          </div>
          <div className="logo" />
        </div>
        <div className="design-name">
          <div className="logo-copy" />
          <h1>xbox one</h1>
        </div>
      </div>
    )
  }
}