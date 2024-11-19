import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

import Clock from "@/components/Clock";
import SeriesInfo from "@/components/SeriesInfo";

import hexToRgba from "@/utils/hexToRgba";

// import ("@/components/styles/Rsc")

// import Rsc from "@/components/styles/Rsc";

import "@/style/statboard.scss";

// const expireEventsInMs = 7000;
const socketServerUrl = "ws://rlws.kdoughboy.com:8321";
// const socketServerUrl = "ws://localhost:8321";

const Statboard = () => {

	const params = useParams();

	const [config, setConfig] = useState({});
	const [clockRunning, setClockRunning] = useState(false);
	const [dataReceived, setDataReceived] = useState(false);
	const [gameData, setGameData] = useState({
		teams: [],
		time_seconds: 0,
	});
	const [playerData, setPlayerData] = useState({});
	const [playerEvents, setPlayerEvents] = useState([]);
	const [seriesScore, setSeriesScore] = useState([0,0]);

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

			case("overlay:game_data"):
				if (data.hasOwnProperty("clockRunning")) {
					setClockRunning(data.clockRunning);
				}
				if (data.hasOwnProperty("config")) {
					setConfig(data.config);
					setDataReceived(true);
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
				if (data.hasOwnProperty("seriesScore")) {
					setSeriesScore(data.seriesScore);
				}
			break;

		}
	}

	return (
		<div id="Statboard">

				{dataReceived ?

					<Fragment>

						<Clock time={gameData.time_seconds} overtime={gameData.isOT} />

						{config.series.show || config.series.override ? (
							<SeriesInfo seriesScore={seriesScore} seriesGame={seriesScore[0] + seriesScore[1] + 1} seriesConfig={config.series} />
						) : null}

						<table className="teamStats">
						{gameData.teams.map((team, teamnum) => (
							<Fragment key={teamnum}>
								<thead>
									<tr className="teamNameHeader" style={{background: hexToRgba(config.teams[teamnum].color ? config.teams[teamnum].color : team.color_primary, 100)}}>
										<th className="teamIdentification" colSpan={8}>
											<span className="teamName">{config.teams[teamnum].name ? config.teams[teamnum].name : team.name}</span>
											{ config.teams[teamnum].franchise ?
												<span className="franchiseName">{config.teams[teamnum].franchise}</span>
											: ""}
										</th>
										<th className="teamScore" colSpan={2}>{team.score}</th>
										{ config.series.show ?
											<th className="seriesScore">{seriesScore[teamnum]}</th>
										: null}
									</tr>
									<tr className="teamHeader">
										<th>Boost</th>
										<th className="tableAlignText">Player</th>
										<th>Score</th>
										<th>Goals</th>
										<th>Assists</th>
										<th>Shots</th>
										<th>Saves</th>
										<th>Touches</th>
										<th>Demos</th>
										<th>Bumps</th>
									</tr>
								</thead>
								<tbody>
									{Object.values(playerData).filter(player => player.team === teamnum).map((player, playerIndex) => (
										<tr
											key={playerIndex}
											style={{background: hexToRgba(config.teams[teamnum].color ? config.teams[teamnum].color : team.color_primary, 30 + 20 * playerIndex)}}
										>
											<td className="playerBoost">{player.boost}</td>
											<td className="playerName tableAlignText">{player.name}</td>
											<td>{player.score}</td>
											<td>{player.goals}</td>
											<td>{player.assists}</td>
											<td>{player.shots}</td>
											<td>{player.saves}</td>
											<td>{player.touches}</td>
											<td>{player.demos}</td>
											<td>{player.cartouches}</td>
										</tr>
									))}
								</tbody>
							</Fragment>
						))}
						</table>

					</Fragment>

				: "No data received" }

		</div>
	)

}

export default Statboard;
