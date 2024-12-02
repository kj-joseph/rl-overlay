import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

import defaultConfig from "@/data/config.json";

import Live from "@/views/overlay/Live";
import Postgame from "@/views/overlay/Postgame";
import Pregame from "@/views/overlay/Pregame";
import Transition from "@/views/overlay/Transition";

import hexToRgba from "@/utils/hexToRgba";
import { v4 as uuidv4 } from "uuid";

const expireEventsInMs = 7000;
const gameSocketUrl = "ws://localhost:49122";
const socketServerUrl = "wss://rlws.kdoughboy.com:8321";
// const socketServerUrl = "wss://localhost:8321";

const Overlay = () => {

	const transitionDefault = {
		logo: null,
		show: false,
		styleClass: "stripeWipe",
		text: "",
	};
	const teamColorsDefault = ["206cff", "f88521"];

	const [clientId, setClientId] = useState("");
	const [clockRunning, setClockRunning] = useState(false);
	const [endGameData, setEndGameData] = useState({});
	const [gameData, setGameData] = useState({
		teams: [{name: ""}, {name: ""}],
		time_seconds: 0,
	});
	const [lastGoal, setLastGoal] = useState({});
	const [playerData, setPlayerData] = useState({});
	const [playerEvents, setPlayerEvents] = useState([]);
	const [seriesScore, setSeriesScore] = useState([0,0]);
	const [teamDataSent, setTeamDataSent] = useState(false);
	const [transition, setTransition] = useState(transitionDefault);
	const [viewState, setViewState] = useState("");
	const [activeConfig, setActiveConfig] = useState(defaultConfig);

	useEffect(() => {

		// on start, check for existing items in localstorage; if not, send default

		if (localStorage.hasOwnProperty("clientId")) {
			setClientId(localStorage.getItem("clientId"));
		} else {
			const newClientId = uuidv4();
			localStorage.setItem("clientId", newClientId);
			setClientId(newClientId);
		}

		if (localStorage.hasOwnProperty("config")) {
			setActiveConfig(JSON.parse(localStorage.getItem("config")));
		} else {
			localStorage.setItem("config", JSON.stringify(activeConfig));
		}

		if (localStorage.hasOwnProperty("seriesScore")) {
			setSeriesScore(JSON.parse(localStorage.getItem("seriesScore")));
		} else {
			localStorage.setItem("seriesScore", JSON.stringify(seriesScore));
		}

		// listen for localstorage updates from control panel
		window.onstorage = (event) => {
			switch(event.key) {
				case "clientId":
					setClientId(event.newValue);
					break;

				case "config":
					if(event.newValue !== null) {
						setActiveConfig(JSON.parse(event.newValue));
					} else {
						setActiveConfig(defaultConfig);
						localStorage.setItem("config", JSON.stringify(defaultConfig));
					}
					break;

				case "seriesScore":
					if(event.newValue !== null) {
						setSeriesScore(JSON.parse(event.newValue));
					} else {
						setSeriesScore([0,0]);
						localStorage.setItem("seriesScore", JSON.stringify([0,0]));
					}
					break;
				}
		};

	}, []);


	// websocket from Rocket League / BakkesMod
	const {
		sendMessage: sendMessageGame,
		sendJsonMessage: sendJsonMessageGame,
		lastMessage: lastMessageGame,
		lastJsonMessage: lastJsonMessageGame,
		readyState: readyStateGame,
		getWebSocket: getWebSocketGame,
	} = useWebSocket(gameSocketUrl, {
		onOpen: () => {},
		onMessage: (msg) => handleGameData(msg.data),
		shouldReconnect: (closeEventGame) => true,
	});

	// my websocket server for updating stats page
	const {
		sendMessage: sendMessageServer,
		sendJsonMessage: sendJsonMessageServer,
		lastMessage: lastMessageServer,
		lastJsonMessage: lastJsonMessageServer,
		readyState: readyStateServer,
		getWebSocket: getWebSocketServer,
	} = useWebSocket(socketServerUrl, {
		onOpen: () => subscribeToServerFeed(),
		onMessage: (msg) => handleServerData(msg.data),
		shouldReconnect: (closeEvent) => true,
	});

	const subscribeToGameFeed = () => {
/* 		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:initialized",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:statfeed_event",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:update_state",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:goal_scored",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:pre_countdown_begin",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:clock_started",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:clock_stopped",
		});

		sendJsonMessageGame({
			event: "wsRelay:register",
			data: "game:match_ended",
		});
 */	}

	// handle data from BakkesMod websocket
	const handleGameData = d => {
		// console.log(d);
		let data, dataParse = {};
		let event = "";

		try {
			dataParse = JSON.parse(d)
			if (!dataParse.hasOwnProperty("data") || !dataParse.hasOwnProperty("event")) {
				return;
			}
			event = dataParse.event;
			// console.log(dataParse.event);
			data = dataParse.data;
			// console.log(event, data);
		} catch(e) {
			console.error(e);
			return;
		}

		switch(event) {
			case "game:clock_stopped":
				setClockRunning(false);
				break;

			case "game:clock_started":
				setClockRunning(true);
				break;

			case "game:initialized":
				setClockRunning(false);
				triggerTransition(
					"stripeWipe noDelay",
					"GO!",
					activeConfig.general.hasOwnProperty("brandLogo") && activeConfig.general.brandLogo ? `${activeConfig.general.brandLogo}` : null,
				);
				setTimeout(() => {
					setViewState("live");
				}, 750);
				break;

			case "game:goal_scored":
				setLastGoal(data);
				triggerTransition(
					`stripeWipe team${data.scorer.teamnum}`,
					"GOAL!",
					activeConfig.teams[data.scorer.teamnum].hasOwnProperty("logo") && activeConfig.teams[data.scorer.teamnum].logo ? `teams/${activeConfig.teams[data.scorer.teamnum].logo}` : activeConfig.general.hasOwnProperty("brandLogo") && activeConfig.general.brandLogo ? `${activeConfig.general.brandLogo}` : null,
				);
				break;

			case "game:match_ended":
				setClockRunning(false);
				const winningTeam = gameData.teams[0].score > gameData.teams[1].score ? 0 : 1;
				setEndGameData({
					gameData,
					playerData,
				});
				setTimeout(() => triggerTransition(
					`stripeWipe team${winningTeam}`,
					"WINNER!",
					activeConfig.teams[winningTeam].hasOwnProperty("logo") && activeConfig.teams[winningTeam].logo ? `teams/${activeConfig.teams[winningTeam].logo}` : activeConfig.general.hasOwnProperty("brandLogo") && activeConfig.general.brandLogo ? `${activeConfig.general.brandLogo}` : null,
				), 1000);
				setTimeout(() => {
					setSeriesScore(sd => ([
						sd[0] + (winningTeam === 0 ? 1 : 0),
						sd[1] + (winningTeam === 1 ? 1 : 0),
					]));
					setViewState("postgame");
				}, 4500);
			break;

			case "game:pre_countdown_begin":
				clearAllPlayerEvents();
				break;

			case "game:statfeed_event":
				if (data.hasOwnProperty("event_name") && data.hasOwnProperty("main_target")) {
					const newEvents = [];

					switch(data.event_name) {
						case "Demolish":
							clearPlayerEvents(data.secondary_target.id);
							newEvents.push({
								playerId: data.secondary_target.id,
								name: "Dead",
							});

						case "Assist":
						case "EpicSave":
						// case "Exterminator":
						case "Goal":
						case "HatTrick":
						case "Save":
						// case "Savior":
						case "Shot":
							newEvents.push({
								playerId: data.main_target.id,
								name: data.event_name,
							});

						break;

					}

					if (newEvents.length) {
						addPlayerEvent(newEvents);
					}

				}
					// console.log("STATFEED", data);
				break;

			case "game:update_state":
				if (data.hasOwnProperty("players")) {
					setPlayerData(data.players);
				}
				if (data.hasOwnProperty("game")) {
					expirePlayerEvents();
					setGameData(data.game);
					if (viewState !== "postgame" && data.game.time_milliseconds % 1 !== 0) {
						setViewState("live");
					} else if (viewState === "") {
						setViewState("pregame");
					}

					// on first load of game data, send team data to local storage for control panel to see
					if (!teamDataSent) {
						localStorage.setItem("teamData", JSON.stringify(data.game.teams));
						setTeamDataSent(true);
					}
				}
				break;

			case "match:created":

				break;


			default:
				// console.log(event, data);
				break;



		}

		sendDataToExternalSources();

	}

	// send game data to websocket server and local storage
	const sendDataToExternalSources = () => {
		sendJsonMessageServer({
			clientId,
			event: "overlay:game_data",
			data: {
				clockRunning,
				config: activeConfig,
				gameData,
				playerData,
				playerEvents,
				seriesScore: seriesScore
			}
		});

		localStorage.setItem("seriesScore", JSON.stringify(seriesScore));

	}

	const subscribeToServerFeed = () => {}

	// player point events
	const addPlayerEvent = (newEvents) => {
		let eventArray = [...playerEvents];

		for (const newEvent of newEvents) {
			eventArray = [...eventArray.filter(ps => !(ps.playerId === newEvent.playerId && ps.name === newEvent.name)),
				{
					playerId: newEvent.playerId,
					name: newEvent.name,
					exp: Date.now() + expireEventsInMs,
				},
			]
		}
		setPlayerEvents(eventArray);
	}

	const clearAllPlayerEvents = () => {
		setPlayerEvents([]);
	}

	const clearPlayerEvents = (playerId) => {
		setPlayerEvents(playerEvents.filter(ps => ps.playerId !== playerId))
	}

	const expirePlayerEvents = () => {
		if (playerEvents.filter(ps => ps.exp <= Date.now()).length > 0) {
			setPlayerEvents(playerEvents.filter(ps => ps.exp > Date.now()));
		}
	}

	// visual transitions
	const triggerTransition = (styleClass, text, logo) => {
		setTransition({
			logo,
			show: true,
			styleClass,
			text,
		});
		setTimeout(() => {
			setTransition(transitionDefault);
		}, 10000);
	}

	return (
		<div
			className={`App ${activeConfig.general.theme || "default"}`}
			id="Overlay"
			style={{
				"--team0": hexToRgba(
					activeConfig.teams[0].color ? activeConfig.teams[0].color
						: gameData.hasOwnProperty("teams")
							&& Array.isArray(gameData.teams)
							&& gameData.teams[0].hasOwnProperty("color_primary")
							? gameData.teams[0].color_primary
						: teamColorsDefault[0]
				, 100),
				"--team0fade": hexToRgba(
					activeConfig.teams[0].color ? activeConfig.teams[0].color
						: gameData.hasOwnProperty("teams")
							&& Array.isArray(gameData.teams)
							&& gameData.teams[0].hasOwnProperty("color_primary")
							? gameData.teams[0].color_primary
						: teamColorsDefault[0]
				, 25),
				"--team1": hexToRgba(
					activeConfig.teams[1].color ? activeConfig.teams[1].color
						: gameData.hasOwnProperty("teams")
							&& Array.isArray(gameData.teams)
							&& gameData.teams[1].hasOwnProperty("color_primary")
							? gameData.teams[1].color_primary
						: teamColorsDefault[1]
				, 100),
				"--team1fade": hexToRgba(
					activeConfig.teams[1].color ? activeConfig.teams[1].color
						: gameData.hasOwnProperty("teams")
							&& Array.isArray(gameData.teams)
							&& gameData.teams[1].hasOwnProperty("color_primary")
							? gameData.teams[1].color_primary
						: teamColorsDefault[1]
				, 25),
			}}
		>

			{/* <div>{clientId}</div> */}

			{viewState === "postgame" ? (
				<Postgame
					config={activeConfig}
					gameData={endGameData.gameData}
					players={endGameData.playerData}
					seriesScore={seriesScore}
					seriesGame={seriesScore[0] + seriesScore[1]}
				/>
			) : viewState ==="pregame" ? (
				<Pregame
					config={activeConfig}
					gameData={gameData}
					seriesScore={seriesScore}
					seriesGame={seriesScore[0] + seriesScore[1] + 1}
				/>
			) : (
				<Live
					clockRunning={clockRunning}
					config={activeConfig}
					gameData={gameData}
					lastGoal={lastGoal}
					playerData={playerData}
					playerEvents={playerEvents}
					seriesScore={seriesScore}
					seriesGame={seriesScore[0] + seriesScore[1] + 1}
				/>
			)}

			<Transition
				transition={transition}
			/>
		</div>
	)

}

export default Overlay;
