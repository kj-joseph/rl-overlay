import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

import Config from "@/data/config.json";

import Live from "@/views/overlay/Live";
import Postgame from "@/views/overlay/Postgame";
import Pregame from "@/views/overlay/Pregame";
import Transition from "@/views/overlay/Transition";

import hexToRgba from "@/utils/hexToRgba";

// TODO: bring in style theme dynamically
import "@/style/overlays/generic/main.scss";

const expireEventsInMs = 7000;
const gameSocketUrl = "ws://localhost:49122";
const socketServerUrl = "ws://rl.kdoughboy.com:8321";
// const socketServerUrl = "ws://localhost:8321";

const Overlay = () => {

	const params = useParams();
	const defaultConfig = Config;

	const transitionDefault = {
		logo: null,
		show: false,
		styleClass: "stripeWipe",
		text: "",
	};
	const teamColorsDefault = ["206cff", "f88521"];

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
	const [transition, setTransition] = useState(transitionDefault);
	const [viewState, setViewState] = useState("");
	const [activeConfig, setActiveConfig] = useState(defaultConfig);
7
	const {
		sendMessage: sendMessageGame,
		sendJsonMessage: sendJsonMessageGame,
		lastMessage: lastMessageGame,
		lastJsonMessage: lastJsonMessageGame,
		readyState: readyStateGame,
		getWebSocket: getWebSocketGame,
	} = useWebSocket(gameSocketUrl, {
		onOpen: () => subscribeToGameFeed(),
		onMessage: (msg) => handleGameData(msg.data),
		shouldReconnect: (closeEventGame) => true,
	});

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
		sendJsonMessageGame({
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
	}

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
			// console.log(data);
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

			// case "game:podium_start":
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
					activeConfig.teams[winningTeam].hasOwnProperty("logo") && activeConfig.teams[winningTeam].hasOwnProperty("logo") ? `teams/${activeConfig.teams[winningTeam].logo}` : null,
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
				}
				break;

		}

		sendStatsToServer();

	}

	const sendStatsToServer = () => {
		sendJsonMessageServer({
			clientId: params.clientId,
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
	}

	const subscribeToServerFeed = () => {
		sendJsonMessageServer({
			clientId: params.clientId,
			event: "register",
		});
	}

	const handleServerData = d => {
		console.log("got something from server");
		console.log(d);
		let data, dataParse = {};
		let event = "";

		try {
			dataParse = JSON.parse(d);
			if (!dataParse.hasOwnProperty("clientId") || !dataParse.hasOwnProperty("event") || !dataParse.hasOwnProperty("data") || dataParse.clientId !== params.clientId) {
				console.log("error");
				return;
			}
			event = dataParse.event;
			// console.log(dataParse);
			data = dataParse.data;
			console.log(event, data);

			// setActiveConfig(data);





		} catch(e) {
			console.error(e);
			return;
		}

		// switch(event) {
		// }
	}


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
		className={`App ${activeConfig.general.style}`}
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
		}}>

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
