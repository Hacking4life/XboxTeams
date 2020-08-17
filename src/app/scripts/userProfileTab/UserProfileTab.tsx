import * as React from "react";
import * as ReactDOM from 'react-dom';
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { AuthenticationService } from "../Utilities/AuthenticationService"
import { AuthToken } from "../Utilities/Model/AuthToken"
import Tab from "../userProfileTab/Tab"
import '../../web/styles/welcome.css';
var $ = require("jquery");


export interface IUserProfileTabState extends ITeamsBaseComponentState {
    entityId?: string;
    isUserAuthenticated: boolean;
    userName: string;
    password: string;
    authToken: AuthToken;
    loginattemptFailed: boolean;
    tokenexpied: boolean;
}
export interface IUserProfileTabProps {
}
export class UserProfileTab extends TeamsBaseComponent<IUserProfileTabProps, IUserProfileTabState> {

    private authService: AuthenticationService;
    public async componentWillMount() {
        this.setState({ isUserAuthenticated: false, loginattemptFailed: false, tokenexpied: false })
        this.authService = new AuthenticationService();
        this.updateTheme(this.getQueryVariable("theme"));
        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }
    }


    private signin() {
        var modal: any = document.getElementById("myModal");
        modal.style.display = "block";
        var span: any = document.getElementsByClassName("closes")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }


    private login(result: any) {
        var modal: any = document.getElementById("myModal");
        modal.style.display = "none";
        console.log(result)
        var username;
        var password;
        if (result != null) {
            username = result.username;
            password = result.password;
            this.authService.getUserToken(username, password).then((token) => {
                console.log(token);
                if (token != null) {
                    if (token.name == "XboxReplayError") {
                        this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                    }
                    else if (new Date(token.expiresOn) > new Date(Date.now())) {
                        this.authService.UserToken = token;
                        this.setState({ isUserAuthenticated: true, userName: username, password: password, authToken: token })
                    }
                    else {
                        this.setState({ isUserAuthenticated: false, loginattemptFailed: false, tokenexpied: true })
                    }
                }
                else {
                    this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                }
            }, (err) => {
                this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                console.log(err);
            });
        };
    }

    private onUserLoginAdaptiveCard = (): void => {
        var adaptiveCard: any;
        if (this.state.loginattemptFailed) {
            adaptiveCard = require("./LoginError.json");
        }
        else {
            adaptiveCard = require("./UserLoginCard.json");

        }
        const taskModuleInfo = {
            title: "XBoxLive User Login",
            card: adaptiveCard,
            width: 500,
            height: 300
        };

        const submitHandler = (err: string, result: any): void => {
            console.log(result)
            var username;
            var password;
            // if(result.username==""||result.password==""){
            if (result != null) {
                if (Object.keys(result).length === 0 || (result.username != null && (result.username == "" || result.password == ""))) {
                    username = "arunjb2016@gmail.com";
                    password = "Clannad@01";
                }
                else {
                    username = result.username;
                    password = result.password;
                }
                this.authService.getUserToken(username, password).then((token) => {
                    console.log(token);
                    if (token != null) {
                        if (token.name == "XboxReplayError") {
                            this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                        }
                        else if (new Date(token.expiresOn) > new Date(Date.now())) {
                            this.authService.UserToken = token;
                            this.setState({ isUserAuthenticated: true, userName: username, password: password, authToken: token })
                        }
                        else {
                            this.setState({ isUserAuthenticated: false, loginattemptFailed: false, tokenexpied: true })
                        }
                    }
                    else {
                        this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                    }
                }, (err) => {
                    this.setState({ isUserAuthenticated: false, loginattemptFailed: true, tokenexpied: false })
                    console.log(err);
                });
            };
        }
        microsoftTeams.tasks.startTask(taskModuleInfo, submitHandler);
    }

    public render() {
        {

            if (this.state.isUserAuthenticated == false && (this.state.tokenexpied || this.state.loginattemptFailed)) {
                this.onUserLoginAdaptiveCard();
                return (<body className='welcomebody'>
                    <div>
                        <nav className="layer">
                            <ul>
                                <li style={{ color: 'black' }}>Home</li>
                                <li style={{ color: 'black' }} onClick={() => { this.signin() }}>Login</li>
                                <li style={{ color: 'black' }} onClick={() => { this.onUserLoginAdaptiveCard(); }}>Acces without authentication ( demo mode)</li>
                                <li style={{ color: 'black' }}>About US</li>
                                <li style={{ color: 'black' }}>FAQ</li>
                            </ul>
                        </nav>
                        <section className="welcomehome page layer">
                        </section>
                    </div>

                    <div id="myModal" className="modals">
                        <div className="modal-contents">
                            <span className="closes">×</span>
                            <div className="img"><svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="266px" height="32px" viewBox="0 0 266 32" xmlSpace="preserve">
                                <rect x={117} y="0.079" fill="#F25022" width={15} height="14.921" />
                                <rect x={134} y="0.079" fill="#7FBA00" width={15} height="14.921" />
                                <rect x={117} y="17.021" fill="#00A4EF" width={15} height="14.906" />
                                <rect x={134} y="17.021" fill="#FFB900" width={15} height="14.906" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M51.627,12.316c-0.396,0-0.822,0.045-1.28,0.144  c-3.198,0.737-3.506,4.297-3.506,4.297s-3.629,0.123-3.629,3.438c0,1.903,0.984,3.806,3.752,3.806c0.922,0,14.515,0,14.515,0  C63.262,24,64,22.465,64,21.115c0-2.762-2.522-3.008-2.522-3.008c0.061-2.026-1.045-3.253-2.215-3.744  c-0.599-0.261-1.175-0.352-1.687-0.352c-1.17,0-2.003,0.475-2.003,0.475C54.904,13.509,53.673,12.316,51.627,12.316z M51.795,8  c-2.177,0-3.959,1.264-4.892,2.988c0,0-0.905-0.564-2.197-0.564c-0.613,0-1.314,0.127-2.048,0.502  c-1.599,0.86-2.583,2.762-2.398,4.604c0,0-3.26,0.246-3.26,3.744c0,1.903,1.723,3.622,3.629,3.622c2.398,0,2.398,0,2.398,0  c-0.615-0.92-0.738-1.842-0.738-2.578c0-3.684,3.875-4.235,3.875-4.235s0.492-3.499,3.936-4.358c0.558-0.136,1.086-0.198,1.58-0.198  c1.958,0,3.39,0.961,4.078,2.039c0,0,0.615-0.368,1.906-0.368c-0.124-1.167-0.984-3.683-3.69-4.788C53.217,8.127,52.486,8,51.795,8z  " />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M99.408,10.995h-5.907v3.312l2.18,1.789L100,12.01v-0.422  C99.999,11.172,99.822,10.995,99.408,10.995z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M99.998,13.212l-3.907,3.696  c-0.108,0.102-0.246,0.153-0.385,0.153c-0.126,0-0.252-0.042-0.356-0.127L93.5,15.416v5.646h5.907c0.414,0,0.591-0.178,0.591-0.592  V13.212z M99.999,13.211L99.999,13.211L99.999,13.211L99.999,13.211z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M87.46,19.702l-0.197-0.006  c-0.211-0.013-0.413-0.046-0.603-0.097c-0.189-0.052-0.368-0.123-0.536-0.214c-0.168-0.09-0.325-0.198-0.473-0.326  c-0.147-0.128-0.283-0.274-0.411-0.439c-0.127-0.167-0.24-0.344-0.336-0.532c-0.095-0.188-0.174-0.387-0.236-0.598  c-0.064-0.211-0.111-0.432-0.142-0.665c-0.032-0.233-0.047-0.478-0.047-0.735c0-0.267,0.015-0.522,0.046-0.763  c0.031-0.243,0.077-0.473,0.139-0.691c0.062-0.218,0.141-0.425,0.233-0.62c0.093-0.196,0.203-0.381,0.329-0.552  c0.128-0.178,0.269-0.335,0.421-0.473c0.152-0.138,0.317-0.254,0.494-0.352c0.178-0.098,0.367-0.174,0.57-0.23  c0.203-0.057,0.422-0.091,0.65-0.106l0.189-0.006c0.147,0,0.289,0.011,0.429,0.032c0.197,0.031,0.386,0.083,0.567,0.157  c0.182,0.075,0.352,0.171,0.513,0.292c0.164,0.12,0.316,0.263,0.459,0.427c0.144,0.167,0.269,0.349,0.377,0.545  c0.109,0.198,0.2,0.412,0.273,0.641c0.072,0.229,0.128,0.473,0.165,0.733c0.036,0.259,0.055,0.533,0.055,0.823  c0,0.296-0.02,0.578-0.057,0.844c-0.038,0.266-0.095,0.518-0.171,0.753c-0.075,0.236-0.17,0.455-0.282,0.659  c-0.113,0.203-0.243,0.39-0.392,0.562c-0.147,0.169-0.305,0.316-0.473,0.441c-0.168,0.123-0.344,0.223-0.531,0.3  c-0.185,0.078-0.379,0.131-0.585,0.162C87.757,19.691,87.61,19.702,87.46,19.702z M92.941,6.969L82,9.472v13.091L92.941,25V6.969z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M87.376,13.779l-0.054,0.001  c-0.117,0.004-0.226,0.021-0.329,0.052c-0.105,0.03-0.2,0.073-0.291,0.129c-0.091,0.055-0.175,0.125-0.252,0.206  c-0.077,0.08-0.149,0.174-0.212,0.28c-0.063,0.102-0.117,0.21-0.164,0.326c-0.047,0.116-0.086,0.239-0.118,0.369  c-0.029,0.13-0.052,0.267-0.068,0.412c-0.016,0.145-0.023,0.297-0.023,0.457c0,0.172,0.008,0.333,0.025,0.487  c0.017,0.153,0.043,0.297,0.077,0.433c0.034,0.136,0.078,0.262,0.129,0.379c0.051,0.118,0.112,0.227,0.18,0.326  c0.065,0.093,0.135,0.175,0.208,0.246l0.237,0.18c0.084,0.049,0.174,0.086,0.268,0.113c0.096,0.027,0.196,0.041,0.301,0.046  l0.059,0.001l0.252-0.024c0.099-0.019,0.193-0.05,0.281-0.091l0.251-0.164l0.22-0.234c0.072-0.097,0.138-0.204,0.192-0.322  c0.055-0.118,0.1-0.246,0.138-0.386c0.036-0.139,0.064-0.289,0.082-0.45c0.018-0.16,0.028-0.331,0.028-0.512  c0-0.185-0.009-0.36-0.026-0.523c-0.018-0.164-0.043-0.318-0.078-0.46c-0.035-0.143-0.078-0.275-0.131-0.396  c-0.051-0.12-0.111-0.23-0.179-0.33c-0.067-0.096-0.138-0.179-0.215-0.25l-0.247-0.176c-0.089-0.046-0.182-0.08-0.281-0.1  C87.554,13.787,87.467,13.779,87.376,13.779z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M257.018,12.053l1.482,4.027l2.849,1.361l-10.348,5.541  l4.044,2.886L266,19.494v-4.576L257.018,12.053z M251,7v15.981l4.01-4.057V8.263L251,7z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M175.024,13.911l-0.016,0.016  c-0.442,0.317-1.928,1.582-3.351,3.1c-1.596,1.74-3.176,3.59-3.24,4.872v0.032l0.016,0.111v0.032l0.032,0.079  c1.643,1.74,3.983,2.847,6.543,2.847c2.623,0,4.994-1.123,6.638-2.926v-0.032v-0.127l-0.016-0.142  c-0.142-1.265-1.675-3.037-3.224-4.73C177,15.526,175.767,14.545,175.024,13.911z M169.224,9.246l-0.221,0.048  C167.17,10.939,166,13.343,166,16c0,2.198,0.822,4.224,2.15,5.806c-0.538-0.712-0.127-2.325,0.68-4.002  c0.284-0.585,0.632-1.171,0.995-1.756c1.359-2.215,3.051-4.097,3.051-4.097c-1.185-1.297-2.339-2.167-2.94-2.5  c-0.158-0.079-0.317-0.142-0.459-0.174l-0.032-0.016L169.224,9.246z M180.808,9.246l-0.221,0.016h-0.032l-0.063,0.016  c-0.711,0.238-2.023,1.281-3.303,2.626c0,0,1.643,1.914,3.066,4.112c0.363,0.57,0.663,1.171,0.964,1.756  c0.759,1.471,1.233,3.258,0.648,4.049C183.195,20.255,184,18.215,184,16c0-2.673-1.17-5.094-3.034-6.739L180.808,9.246z   M169.915,8.589l-0.012,0.008L169.915,8.589z M175.009,6.999c-1.891,0-3.657,0.582-5.092,1.589c0.109-0.075,0.247-0.136,0.414-0.182  c0.101-0.023,0.22-0.033,0.353-0.033c0.51,0,1.217,0.159,1.844,0.398c1.074,0.411,2.118,1.029,2.497,1.281  c0.396-0.253,1.391-0.839,2.465-1.265c0.544-0.216,1.21-0.401,1.795-0.401c0.145,0,0.286,0.012,0.417,0.036  c0.142,0.032,0.269,0.079,0.363,0.142C178.627,7.585,176.889,6.999,175.009,6.999z" />
                                <path opacity="0.3" fill="#333339" d="M217.039,19.676c1.234,0,1.916-0.672,1.916-1.359c0-0.414-0.203-0.872-1.016-1.072  l-2.686-0.673c-2.163-0.544-2.556-1.716-2.556-2.818c0-2.288,2.149-3.146,4.167-3.146c1.858,0,4.05,1.029,4.05,2.402  c0,0.588-0.508,0.93-1.089,0.93c-1.103,0-0.9-1.53-3.121-1.53c-1.103,0-1.714,0.501-1.714,1.216c0,0.715,0.871,0.943,1.627,1.116  l1.988,0.442c2.177,0.486,2.73,1.76,2.73,2.961c0,1.859-1.423,3.247-4.297,3.247c-3.02,0-4.37-1.488-4.37-2.603  c0-0.572,0.421-0.973,1.002-0.973C214.963,17.816,214.628,19.676,217.039,19.676 M213.027,7C210.251,7,208,9.25,208,12.027  c0,0.885,0.229,1.717,0.63,2.439c-0.091,0.497-0.135,1.012-0.135,1.536c0,4.699,3.807,8.505,8.505,8.505  c0.524,0,1.036-0.047,1.534-0.138c0.722,0.401,1.554,0.63,2.439,0.63c2.777,0,5.027-2.251,5.027-5.027  c0-0.885-0.228-1.717-0.63-2.439c0.091-0.497,0.136-1.008,0.136-1.532c0-4.699-3.807-8.51-8.506-8.51  c-0.524,0-1.037,0.047-1.534,0.138C214.744,7.229,213.912,7,213.027,7" />
                                <path opacity="0.3" fill="#333339" d="M0,21.437L0,21.437 M10,7l-9.974,3.625H0v10.812l2.968-1.611v-8.794L10,9.835v12.936L0,21.437  L10,25l4.995-1.483v-0.018V8.545L10,7" />
                            </svg></div>
                            <h1 className="main_heading">Sign In</h1>
                            <p style={{ color: 'black', textAlign: 'center' }}>Use your Microsoft account.</p><br />
                            <input style={{ margin: 'auto', display: 'block', color: 'black' }} id="un" type="text" className="text_box" placeholder="Ms Live ID" /><br />
                            <input style={{ margin: 'auto', display: 'block', color: 'black' }} id="psswd" type="password" className="text_box" placeholder="Password" /><br />
                            <button style={{ margin: 'auto', display: 'block' }} className="button" onClick={() => {
                                var username = $("#un").val();
                                var password = $("#psswd").val();
                                console.log(username);
                                console.log(password);
                                var res = {
                                    username: username,
                                    password: password
                                };
                                this.login(res)
                            }} >Submit</button>
                            <p style={{ color: 'black', textAlign: 'center' }}>No account? <a style={{ color: 'blue', textAlign: 'center' }}>Create one!</a></p>
                        </div>
                    </div>
                </body>)
            }
            else if (this.state.isUserAuthenticated) {
                return (<Tab username={this.state.userName} password={this.state.password} token={this.state.authToken} />);
            }
            else {
                return (<body className='welcomebody'>
                    <div>
                        <nav className="layer">
                            <ul>
                                <li style={{ color: 'black' }}>Home</li>
                                <li style={{ color: 'black' }} onClick={() => { this.signin() }}>Login</li>
                                <li style={{ color: 'black' }} onClick={() => { this.onUserLoginAdaptiveCard(); }}>Acces without authentication ( demo mode)</li>
                                <li style={{ color: 'black' }}>About US</li>
                                <li style={{ color: 'black' }}>FAQ</li>
                            </ul>
                        </nav>
                        <section className="welcomehome page layer">
                        </section>
                    </div>

                    <div id="myModal" className="modals">
                        <div className="modal-contents">
                            <span className="closes">×</span>
                            <div className="img"><svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="266px" height="32px" viewBox="0 0 266 32" xmlSpace="preserve">
                                <rect x={117} y="0.079" fill="#F25022" width={15} height="14.921" />
                                <rect x={134} y="0.079" fill="#7FBA00" width={15} height="14.921" />
                                <rect x={117} y="17.021" fill="#00A4EF" width={15} height="14.906" />
                                <rect x={134} y="17.021" fill="#FFB900" width={15} height="14.906" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M51.627,12.316c-0.396,0-0.822,0.045-1.28,0.144  c-3.198,0.737-3.506,4.297-3.506,4.297s-3.629,0.123-3.629,3.438c0,1.903,0.984,3.806,3.752,3.806c0.922,0,14.515,0,14.515,0  C63.262,24,64,22.465,64,21.115c0-2.762-2.522-3.008-2.522-3.008c0.061-2.026-1.045-3.253-2.215-3.744  c-0.599-0.261-1.175-0.352-1.687-0.352c-1.17,0-2.003,0.475-2.003,0.475C54.904,13.509,53.673,12.316,51.627,12.316z M51.795,8  c-2.177,0-3.959,1.264-4.892,2.988c0,0-0.905-0.564-2.197-0.564c-0.613,0-1.314,0.127-2.048,0.502  c-1.599,0.86-2.583,2.762-2.398,4.604c0,0-3.26,0.246-3.26,3.744c0,1.903,1.723,3.622,3.629,3.622c2.398,0,2.398,0,2.398,0  c-0.615-0.92-0.738-1.842-0.738-2.578c0-3.684,3.875-4.235,3.875-4.235s0.492-3.499,3.936-4.358c0.558-0.136,1.086-0.198,1.58-0.198  c1.958,0,3.39,0.961,4.078,2.039c0,0,0.615-0.368,1.906-0.368c-0.124-1.167-0.984-3.683-3.69-4.788C53.217,8.127,52.486,8,51.795,8z  " />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M99.408,10.995h-5.907v3.312l2.18,1.789L100,12.01v-0.422  C99.999,11.172,99.822,10.995,99.408,10.995z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M99.998,13.212l-3.907,3.696  c-0.108,0.102-0.246,0.153-0.385,0.153c-0.126,0-0.252-0.042-0.356-0.127L93.5,15.416v5.646h5.907c0.414,0,0.591-0.178,0.591-0.592  V13.212z M99.999,13.211L99.999,13.211L99.999,13.211L99.999,13.211z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M87.46,19.702l-0.197-0.006  c-0.211-0.013-0.413-0.046-0.603-0.097c-0.189-0.052-0.368-0.123-0.536-0.214c-0.168-0.09-0.325-0.198-0.473-0.326  c-0.147-0.128-0.283-0.274-0.411-0.439c-0.127-0.167-0.24-0.344-0.336-0.532c-0.095-0.188-0.174-0.387-0.236-0.598  c-0.064-0.211-0.111-0.432-0.142-0.665c-0.032-0.233-0.047-0.478-0.047-0.735c0-0.267,0.015-0.522,0.046-0.763  c0.031-0.243,0.077-0.473,0.139-0.691c0.062-0.218,0.141-0.425,0.233-0.62c0.093-0.196,0.203-0.381,0.329-0.552  c0.128-0.178,0.269-0.335,0.421-0.473c0.152-0.138,0.317-0.254,0.494-0.352c0.178-0.098,0.367-0.174,0.57-0.23  c0.203-0.057,0.422-0.091,0.65-0.106l0.189-0.006c0.147,0,0.289,0.011,0.429,0.032c0.197,0.031,0.386,0.083,0.567,0.157  c0.182,0.075,0.352,0.171,0.513,0.292c0.164,0.12,0.316,0.263,0.459,0.427c0.144,0.167,0.269,0.349,0.377,0.545  c0.109,0.198,0.2,0.412,0.273,0.641c0.072,0.229,0.128,0.473,0.165,0.733c0.036,0.259,0.055,0.533,0.055,0.823  c0,0.296-0.02,0.578-0.057,0.844c-0.038,0.266-0.095,0.518-0.171,0.753c-0.075,0.236-0.17,0.455-0.282,0.659  c-0.113,0.203-0.243,0.39-0.392,0.562c-0.147,0.169-0.305,0.316-0.473,0.441c-0.168,0.123-0.344,0.223-0.531,0.3  c-0.185,0.078-0.379,0.131-0.585,0.162C87.757,19.691,87.61,19.702,87.46,19.702z M92.941,6.969L82,9.472v13.091L92.941,25V6.969z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M87.376,13.779l-0.054,0.001  c-0.117,0.004-0.226,0.021-0.329,0.052c-0.105,0.03-0.2,0.073-0.291,0.129c-0.091,0.055-0.175,0.125-0.252,0.206  c-0.077,0.08-0.149,0.174-0.212,0.28c-0.063,0.102-0.117,0.21-0.164,0.326c-0.047,0.116-0.086,0.239-0.118,0.369  c-0.029,0.13-0.052,0.267-0.068,0.412c-0.016,0.145-0.023,0.297-0.023,0.457c0,0.172,0.008,0.333,0.025,0.487  c0.017,0.153,0.043,0.297,0.077,0.433c0.034,0.136,0.078,0.262,0.129,0.379c0.051,0.118,0.112,0.227,0.18,0.326  c0.065,0.093,0.135,0.175,0.208,0.246l0.237,0.18c0.084,0.049,0.174,0.086,0.268,0.113c0.096,0.027,0.196,0.041,0.301,0.046  l0.059,0.001l0.252-0.024c0.099-0.019,0.193-0.05,0.281-0.091l0.251-0.164l0.22-0.234c0.072-0.097,0.138-0.204,0.192-0.322  c0.055-0.118,0.1-0.246,0.138-0.386c0.036-0.139,0.064-0.289,0.082-0.45c0.018-0.16,0.028-0.331,0.028-0.512  c0-0.185-0.009-0.36-0.026-0.523c-0.018-0.164-0.043-0.318-0.078-0.46c-0.035-0.143-0.078-0.275-0.131-0.396  c-0.051-0.12-0.111-0.23-0.179-0.33c-0.067-0.096-0.138-0.179-0.215-0.25l-0.247-0.176c-0.089-0.046-0.182-0.08-0.281-0.1  C87.554,13.787,87.467,13.779,87.376,13.779z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M257.018,12.053l1.482,4.027l2.849,1.361l-10.348,5.541  l4.044,2.886L266,19.494v-4.576L257.018,12.053z M251,7v15.981l4.01-4.057V8.263L251,7z" />
                                <path opacity="0.3" fill="#333339" enableBackground="new    " d="M175.024,13.911l-0.016,0.016  c-0.442,0.317-1.928,1.582-3.351,3.1c-1.596,1.74-3.176,3.59-3.24,4.872v0.032l0.016,0.111v0.032l0.032,0.079  c1.643,1.74,3.983,2.847,6.543,2.847c2.623,0,4.994-1.123,6.638-2.926v-0.032v-0.127l-0.016-0.142  c-0.142-1.265-1.675-3.037-3.224-4.73C177,15.526,175.767,14.545,175.024,13.911z M169.224,9.246l-0.221,0.048  C167.17,10.939,166,13.343,166,16c0,2.198,0.822,4.224,2.15,5.806c-0.538-0.712-0.127-2.325,0.68-4.002  c0.284-0.585,0.632-1.171,0.995-1.756c1.359-2.215,3.051-4.097,3.051-4.097c-1.185-1.297-2.339-2.167-2.94-2.5  c-0.158-0.079-0.317-0.142-0.459-0.174l-0.032-0.016L169.224,9.246z M180.808,9.246l-0.221,0.016h-0.032l-0.063,0.016  c-0.711,0.238-2.023,1.281-3.303,2.626c0,0,1.643,1.914,3.066,4.112c0.363,0.57,0.663,1.171,0.964,1.756  c0.759,1.471,1.233,3.258,0.648,4.049C183.195,20.255,184,18.215,184,16c0-2.673-1.17-5.094-3.034-6.739L180.808,9.246z   M169.915,8.589l-0.012,0.008L169.915,8.589z M175.009,6.999c-1.891,0-3.657,0.582-5.092,1.589c0.109-0.075,0.247-0.136,0.414-0.182  c0.101-0.023,0.22-0.033,0.353-0.033c0.51,0,1.217,0.159,1.844,0.398c1.074,0.411,2.118,1.029,2.497,1.281  c0.396-0.253,1.391-0.839,2.465-1.265c0.544-0.216,1.21-0.401,1.795-0.401c0.145,0,0.286,0.012,0.417,0.036  c0.142,0.032,0.269,0.079,0.363,0.142C178.627,7.585,176.889,6.999,175.009,6.999z" />
                                <path opacity="0.3" fill="#333339" d="M217.039,19.676c1.234,0,1.916-0.672,1.916-1.359c0-0.414-0.203-0.872-1.016-1.072  l-2.686-0.673c-2.163-0.544-2.556-1.716-2.556-2.818c0-2.288,2.149-3.146,4.167-3.146c1.858,0,4.05,1.029,4.05,2.402  c0,0.588-0.508,0.93-1.089,0.93c-1.103,0-0.9-1.53-3.121-1.53c-1.103,0-1.714,0.501-1.714,1.216c0,0.715,0.871,0.943,1.627,1.116  l1.988,0.442c2.177,0.486,2.73,1.76,2.73,2.961c0,1.859-1.423,3.247-4.297,3.247c-3.02,0-4.37-1.488-4.37-2.603  c0-0.572,0.421-0.973,1.002-0.973C214.963,17.816,214.628,19.676,217.039,19.676 M213.027,7C210.251,7,208,9.25,208,12.027  c0,0.885,0.229,1.717,0.63,2.439c-0.091,0.497-0.135,1.012-0.135,1.536c0,4.699,3.807,8.505,8.505,8.505  c0.524,0,1.036-0.047,1.534-0.138c0.722,0.401,1.554,0.63,2.439,0.63c2.777,0,5.027-2.251,5.027-5.027  c0-0.885-0.228-1.717-0.63-2.439c0.091-0.497,0.136-1.008,0.136-1.532c0-4.699-3.807-8.51-8.506-8.51  c-0.524,0-1.037,0.047-1.534,0.138C214.744,7.229,213.912,7,213.027,7" />
                                <path opacity="0.3" fill="#333339" d="M0,21.437L0,21.437 M10,7l-9.974,3.625H0v10.812l2.968-1.611v-8.794L10,9.835v12.936L0,21.437  L10,25l4.995-1.483v-0.018V8.545L10,7" />
                            </svg></div>
                            <h1 className="main_heading">Sign In</h1>
                            <p style={{ color: 'black', textAlign: 'center' }}>Use your Microsoft account.</p><br />
                            <input style={{ margin: 'auto', display: 'block', color: 'black' }} id="un" type="text" className="text_box" placeholder="Ms Live ID" /><br />
                            <input style={{ margin: 'auto', display: 'block', color: 'black' }} id="psswd" type="password" className="text_box" placeholder="Password" /><br />
                            <button style={{ margin: 'auto', display: 'block' }} className="button" onClick={() => {
                                var username = $("#un").val();
                                var password = $("#psswd").val();
                                console.log(username);
                                console.log(password);
                                var res = {
                                    username: username,
                                    password: password
                                };
                                this.login(res)
                            }} >Submit</button>
                            <p style={{ color: 'black', textAlign: 'center' }}>No account? <a style={{ color: 'blue', textAlign: 'center' }}>Create one!</a></p>
                        </div>
                    </div>
                </body>

                )
            }

        }
    }
}