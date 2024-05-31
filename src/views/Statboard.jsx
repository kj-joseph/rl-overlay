import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

import Live from "@/views/Live";
import GameStats from "@/views/GameStats";
import Pregame from "@/views/Pregame";
import Transition from "@/views/Transition";

// import ("@/components/styles/Rsc")

// import Rsc from "@/components/styles/Rsc";

import "@/style/rsc/main.css";

const expireEventsInMs = 7000;
const socketServerUrl = "ws://rl.kdoughboy.com:8321";
// const socketServerUrl = "ws://localhost:8321";

const seriesDefault = {
	game: 0,
	score: [0, 0],
}

const Statboard = () => {

	const params = useParams();

	const [config, setConfig] = useState({});
	const [clockRunning, setClockRunning] = useState(false);
	const [gameData, setGameData] = useState({
		teams: [],
		time_seconds: 0,
	});
	const [playerData, setPlayerData] = useState({});
	const [playerEvents, setPlayerEvents] = useState([]);
	const [seriesData, setSeriesData] = useState({
		...seriesDefault,
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

	const subscribeToServerFeed = () => {
		sendJsonMessageServer({
			clientId: params.clientId,
			event: "register",
			data: "overlay:game_data"
		});

	}

	const handleServerData = d => {
		// console.log("got something from server");
		// console.log(d);
		let data, dataParse = {};
		let event = "";

		try {
			dataParse = JSON.parse(d)
			if (!dataParse.hasOwnProperty("clientId") || !dataParse.hasOwnProperty("event") || !dataParse.hasOwnProperty("data") || dataParse.clientId !== params.clientId) {
				console.log("error");
				return;
			}
			event = dataParse.event;
			data = dataParse.data;
			// console.log(event, data);

		} catch(e) {
			console.error(e);
			return;
		}

		switch(event) {

			case("game_data"):
				if (data.hasOwnProperty("clockRunning")) {
					setClockRunning(data.clockRunning);
				}
				if (data.hasOwnProperty("config")) {
					setConfig(data.config);
				}
				if (data.hasOwnProperty("gameData")) {
					setGameData(data.gameData);
				}
				if (data.hasOwnProperty("playerData")) {
					setPlayerData(data.playerData);
				}
				if (data.hasOwnProperty("playerEvents")) {
					setPlayerEvents(data.playerEvents);
				}
				if (data.hasOwnProperty("seriesData")) {
					setSeriesData(data.seriesData);
				}
			break;

		}
	}

	const timeDisplay = (timeInSeconds) => {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = timeInSeconds - minutes * 60;
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
	}

	return (
		<div className="statboard">
			<div className="timeX">{gameData.isOT ? "OT +" : ""}{timeDisplay(gameData.time_seconds)}</div>
			{gameData.teams.map((team, teamnum) => (
				<table id={`teamStats{teamnum}`} key={teamnum}>
					<thead>
						<tr className="teamNameHeader">
							<th className="teamNameX" colSpan={7}>{team.name}</th>
							<th className="teamScoreX">{team.score}</th>
						</tr>
						<tr className="teamHeader">
							<th>Boost</th>
							<th>Score</th>
							<th>Goals</th>
							<th>Assists</th>
							<th>Shots</th>
							<th>Saves</th>
							<th>Demos</th>
							<th>Touches</th>
						</tr>
					</thead>
					<tbody>
						{Object.values(playerData).filter(player => player.team === teamnum).map((player, playerIndex) => (
							<tr key={playerIndex}>
								<td className="playerBoost">{player.boost}</td>
								<td className="playerName">{player.name}</td>
								<td>{player.score}</td>
								<td>{player.goals}</td>
								<td>{player.assists}</td>
								<td>{player.shots}</td>
								<td>{player.saves}</td>
								<td>{player.demos}</td>
								<td>{player.touches}</td>
							</tr>
						))}
					</tbody>
				</table>
			))}
		</div>
	)

}

export default Statboard;
