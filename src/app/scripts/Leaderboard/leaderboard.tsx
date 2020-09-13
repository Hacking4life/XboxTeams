import * as React from "react";
import '../../web/styles/Leaderboard.css';
import { gamercard } from "../GamerCard/gamercard"
const axios = require('axios');
import { AuthenticationService } from "../Utilities/AuthenticationService";
import { AuthToken } from "../Utilities/Model/AuthToken";
import * as https from "https";
import * as querystring from "querystring";

let colors = [
	'#FFB900',
	'#69797E',
	'#847545',
	'#E74856',
	'#0078D7',
	'#0099BC',
	'#7A7574',
	'#767676',
	'#FF8C00',
	'#E81123',
	'#0063B1',
	'#2D7D9A',
	'#5D5A58',
	'#4C4A48',
	'#F7630C',
	'#EA005E',
	'#8E8CD8',
	'#00B7C3',
	'#68768A',
	'#CA5010',
	'#C30052',
	'#6B69D6',
	'#038387',
	'#515C6B',
	'#4A5459',
	'#DA3B01',
	'#E3008C',
	'#8764B8',
	'#00B294',
	'#567C73',
	'#647C64',
	'#EF6950',
	'#BF0077',
	'#744DA9',
	'#018574',
	'#486860',
	'#525E54',
	'#D13438',
	'#C239B3',
	'#B146C2',
	'#00CC6A',
	'#498205',
	'#FF4343',
	'#9A0089',
	'#881798',
	'#10893E',
	'#107C10',
	'#7E735F'
];

interface MyState {
	leaders: Array<any>,
	maxScore: number
	entityId?: string;
	Gamerscore: string;
	GamerTag: string;
	Gamerpic: string;
	dataloaded: boolean;


}

export class Leaderboard extends React.Component<{ username: string, password: string }, MyState> {
	constructor(props) {
		super(props);

		this.getData = this.getData.bind(this);
	}

	public async getUserProfile(token: AuthToken) {
		let data = {
			success: true,
			leaders: [
				{ id: 1, name: 'L LAWLIET3726', score: 12495 },
				{ id: 3, name: 'Kekland', score: 275 },
				{ id: 2, name: 'Madopew', score: 220 },
				{ id: 4, name: 'Yussend', score: 200 },
				{ id: 5, name: 'Admin', score: 175 }
			],
			maxScore: 500
		};
		const postData = querystring.stringify({
			xuid: token.userXUID,
			uhash: token.userHash,
			token: token.XSTSToken
		});
		const options = {
			path: "https://xboxliveauthenticatorservice.azurewebsites.net/profile",
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": postData.length
			}
		};
		let fprofile_json=""; 
    let ctx=this;
		const req = https.request(options, (res) => {
			res.setEncoding('utf8');
        res.on("data" , function (chunk) {
			fprofile_json += chunk;
        });
		res.on("end",  function () {
				try {
					const profile: any = JSON.parse(fprofile_json.toString());
					ctx.setState(
						{
							Gamerscore: ctx.search("Gamerscore", profile),
							GamerTag: ctx.search("Gamertag", profile),
							Gamerpic: String(ctx.search("GameDisplayPicRaw", profile)).toLocaleLowerCase().indexOf('https') > 0 ? ctx.search("GameDisplayPicRaw", profile) : "https://cdn.dribbble.com/users/924650/screenshots/6606195/robohobo_detailed.png",
							leaders: data.leaders,
							maxScore: data.maxScore,
							dataloaded: true
						});
				}
				catch (ex) {
					console.log(ex);
					ctx.setState({
						dataloaded: true
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
	public search(key, array: Array<any>): string {
		for (let i = 0; i <= array.length - 1; i++) {
			if (array[i].id == key) {
				return array[i].value;
			}
		}
		return "";
	}

	private getData() {
		/* Here you can implement data fetching */
		let data = {
			success: true,
			leaders: [
				{ id: 1, name: 'L LAWLIET3726', score: 12495 },
				{ id: 3, name: 'Kekland', score: 275 },
				{ id: 2, name: 'Madopew', score: 220 },
				{ id: 4, name: 'Yussend', score: 200 },
				{ id: 5, name: 'Admin', score: 175 }
			],
			maxScore: 500
		};
		this.setState({
			leaders: data.leaders,
			maxScore: data.maxScore
		})
	}
	public async componentWillMount() {
		this.setState({ leaders: [], maxScore: 500, dataloaded: false });
		var authService = new AuthenticationService();
		let token: AuthToken = await authService.getUserToken(this.props.username, this.props.password);
		this.getUserProfile(token);
	}
	render() {
		if (this.state.dataloaded) {
			return (
				<div className="l-wrapper">
					<div className="l-grid">
						<div className="l-grid__item l-grid__item--sticky">
							<div className="c-card u-bg--light-gradient u-text--dark">
								<div className="c-card__body">
									<div className="u-display--flex u-justify--space-between">
										<div className="u-text--left">
											<div className="u-text--small">My Rank</div>
											<h2>1st</h2>
										</div>
										<div className="u-text--right">
											<div className="u-text--small">My Score</div>
											<h2>{this.state.Gamerscore}</h2>
										</div>
									</div>
								</div>
							</div>
							<div className="c-card">
								<div className="c-card__body">
									<div className="u-text--center" id="winner" >All Time Champion
                <img className="c-avatar c-avatar--lg" src="https://cdn.dribbble.com/users/924650/screenshots/6606195/robohobo_detailed.png" />
										<h3 className="u-mt--16">L LAWLIET3726</h3>
										<span className="u-text--teal u-text--small">L LAWLIET3726</span>
									</div><br></br>
									<button className="c-button c-button--primary">Send Kudos</button>
								</div>
							</div>
						</div>
						<div className="Leaderboard">
							<div className="leaders">
								{this.state.leaders ? (
									this.state.leaders.map((el, i) => (
										<div
											key={el.id}
											style={{
												animationDelay: i * 0.1 + 's'
											}}
											className="leader"
										>
											<div className="leader-wrap">
												{i < 3 ? (
													<div
														style={{
															backgroundColor: colors[i]
														}}
														className="leader-ava"
													>
														<svg
															fill="#fff"
															xmlns="http://www.w3.org/2000/svg"
															height={24}
															width={24}
															viewBox="0 0 32 32"
														>
															<path d="M 16 3 C 14.354991 3 13 4.3549901 13 6 C 13 7.125993 13.63434 8.112309 14.5625 8.625 L 11.625 14.5 L 7.03125 11.21875 C 7.6313215 10.668557 8 9.8696776 8 9 C 8 7.3549904 6.6450096 6 5 6 C 3.3549904 6 2 7.3549904 2 9 C 2 10.346851 2.9241199 11.470238 4.15625 11.84375 L 6 22 L 6 26 L 6 27 L 7 27 L 25 27 L 26 27 L 26 26 L 26 22 L 27.84375 11.84375 C 29.07588 11.470238 30 10.346852 30 9 C 30 7.3549901 28.645009 6 27 6 C 25.354991 6 24 7.3549901 24 9 C 24 9.8696781 24.368679 10.668557 24.96875 11.21875 L 20.375 14.5 L 17.4375 8.625 C 18.36566 8.112309 19 7.125993 19 6 C 19 4.3549901 17.645009 3 16 3 z M 16 5 C 16.564129 5 17 5.4358709 17 6 C 17 6.5641291 16.564129 7 16 7 C 15.435871 7 15 6.5641291 15 6 C 15 5.4358709 15.435871 5 16 5 z M 5 8 C 5.5641294 8 6 8.4358706 6 9 C 6 9.5641286 5.5641291 10 5 10 C 4.4358709 10 4 9.5641286 4 9 C 4 8.4358706 4.4358706 8 5 8 z M 27 8 C 27.564129 8 28 8.4358709 28 9 C 28 9.5641283 27.564128 10 27 10 C 26.435872 10 26 9.5641283 26 9 C 26 8.4358709 26.435871 8 27 8 z M 16 10.25 L 19.09375 16.4375 L 20.59375 16.8125 L 25.59375 13.25 L 24.1875 21 L 7.8125 21 L 6.40625 13.25 L 11.40625 16.8125 L 12.90625 16.4375 L 16 10.25 z M 8 23 L 24 23 L 24 25 L 8 25 L 8 23 z" />
														</svg>
													</div>
												) : null}
												<div className="leader-content">
													<div className="leader-name">{i + 1 + '. ' + el.name}</div>
													<div className="leader-score">
														<svg
															fill="currentColor"
															height="20"
															viewBox="0 0 493 493"
															version="1.1"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path d="M247,468 C369.05493,468 468,369.05493 468,247 C468,124.94507 369.05493,26 247,26 C124.94507,26 26,124.94507 26,247 C26,369.05493 124.94507,468 247,468 Z M236.497159,231.653661 L333.872526,231.653661 L333.872526,358.913192 C318.090922,364.0618 303.232933,367.671368 289.298112,369.742004 C275.363292,371.81264 261.120888,372.847943 246.570473,372.847943 C209.522878,372.847943 181.233938,361.963276 161.702804,340.193617 C142.17167,318.423958 132.40625,287.169016 132.40625,246.427855 C132.40625,206.805956 143.738615,175.914769 166.403684,153.753368 C189.068753,131.591967 220.491582,120.511432 260.673112,120.511432 C285.856523,120.511432 310.144158,125.548039 333.536749,135.621403 L316.244227,177.257767 C298.336024,168.303665 279.700579,163.826682 260.337335,163.826682 C237.840155,163.826682 219.820296,171.381591 206.277218,186.491638 C192.734139,201.601684 185.962702,221.915997 185.962702,247.435186 C185.962702,274.073638 191.419025,294.415932 202.331837,308.462679 C213.244648,322.509425 229.109958,329.532693 249.928244,329.532693 C260.785092,329.532693 271.809664,328.413447 283.002291,326.174922 L283.002291,274.96891 L236.497159,274.96891 L236.497159,231.653661 Z"></path>
														</svg>
														<div className="leader-score_title">{el.score}</div>
													</div>
												</div>
											</div>
											<div style={{ animationDelay: 0.4 + i * 0.2 + 's' }} className="leader-bar">
												<div
													style={{
														backgroundColor: colors[i],
														width: 100 + '%'
													}}
													className="bar"
												/>
											</div>
										</div>
									))
								) : (
										<div className="empty">Пусто</div>
									)}
							</div>
						</div>
					</div>
				</div>

			);
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
}


