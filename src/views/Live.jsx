import React, { Fragment, useEffect, useState } from 'react';

import useWebSocket from 'react-use-websocket';

import Ball from '@/components/Ball';
import Clock from '@/components/Clock';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Watching from '@/components/Watching';
import TeamName from '@/components/TeamName';
import TeamPlayers from '@/components/TeamPlayers';
import TeamScore from '@/components/TeamScore';
import Replay from '@/components/Replay';

import Config from "@/data/config.json";

const socketUrl = 'ws://localhost:49322';
let needToSubscribe = false;

const expireEffectInMs = 5000;

const Live = () => {

    const [clockRunning, setClockRunning] = useState(false);
	const [gameData, setGameData] = useState({
		teams: [],
		time_seconds: 0,
	});
	const [lastGoal, setLastGoal] = useState({});
	const [playerData, setPlayerData] = useState({});
	const [playerEffects, setPlayerEffects] = useState([]);

	const {
	  sendMessage,
	  sendJsonMessage,
	  lastMessage,
	  lastJsonMessage,
	  readyState,
	  getWebSocket,
	} = useWebSocket(socketUrl, {
	  onOpen: () => (needToSubscribe = true),
	  onMessage: (msg) => handleData(msg.data),
	  //Will attempt to reconnect on all close events, such as server shutting down
	  shouldReconnect: (closeEvent) => true,
	});

	useEffect(() => {
		function subscribeToFeed() {
			sendJsonMessage({
				event: "wsRelay:register",
				data: "game:statfeed_event",
			});

			sendJsonMessage({
				event: "wsRelay:register",
				data: "game:update_state",
			});

			sendJsonMessage({
				event: "wsRelay:register",
				data: "game:goal_scored",
			});

            sendJsonMessage({
				event: "wsRelay:register",
				data: "game:pre_countdown_begin",
			});

            sendJsonMessage({
				event: "wsRelay:register",
				data: "game:clock_started",
			});

            sendJsonMessage({
				event: "wsRelay:register",
				data: "game:clock_stopped",
			});

		}
		if (needToSubscribe) {
			needToSubscribe = false;
			subscribeToFeed();
		}

	});

	const handleData = d => {

		// console.log(d);


		let data, dataParse = {};
		let event = "";

		try {
			dataParse = JSON.parse(d)
			if (!dataParse.hasOwnProperty("data") || !dataParse.hasOwnProperty("event"))  {
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

			case "game:goal_scored":
				// console.log("GOAL", data);
				setLastGoal(data);
				break;

            case "game:pre_countdown_begin":
                clearAllPlayerEffects();
                break;

			case "game:statfeed_event":
				if (data.hasOwnProperty("event_name") && data.hasOwnProperty("main_target")) {
					const newEffects = [];

					switch(data.event_name) {
						case "Demolish":
							newEffects.push({
								playerId: data.secondary_target.id,
								effect: "Dead",
							});

						case "Assist":
						case "EpicSave":
						// case "Exterminator":
						case "Goal":
						case "HatTrick":
						case "Save":
						// case "Savior":
						case "Shot":
							newEffects.push({
								playerId: data.main_target.id,
								effect: data.event_name,
							});

						break;

					}

					if (newEffects.length) {
						addPlayerEffect(newEffects);
					}

				}
					// console.log("STATFEED", data);
				break;

			case "game:update_state":
				if (data.hasOwnProperty("players")) {

                    // data.players.Mountain_3.name = "Testing Really Really Really Really Long Name";
                    // data.players.Cougar_5.name = "Testing Really Long Name";
                    // data.players.Sabretooth_6.name = "TestingReallyLongCompoundNameRightHere";


					setPlayerData(data.players);
				}
				if (data.hasOwnProperty("game")) {
/* 					if (!gameData.isReplay && data.game.isReplay) {
						clearAllPlayerEffects();
					} else {
						expirePlayerEffects();
					} */
                    expirePlayerEffects();
					setGameData(data.game);
				}
				break;

		}

	}

	const addPlayerEffect = (newEffects) => {
		let effectArray = [...playerEffects];

		for (const newEffect of newEffects) {
			effectArray = [...effectArray.filter(ps => !(ps.playerId === newEffect.playerId && ps.effect === newEffect.effect)),
				{
					playerId: newEffect.playerId,
					effect: newEffect.effect,
					exp: Date.now() + expireEffectInMs,
				},
			]
		}
		setPlayerEffects(effectArray);
	}

	const clearAllPlayerEffects = () => {
		setPlayerEffects([]);
	}

	const clearPlayerEffects = (playerId) => {
		setPlayerEffects(playerEffects.filter(ps => ps.playerId !== playerId))
	}

	const expirePlayerEffects = () => {
		if (playerEffects.filter(ps => ps.exp <= Date.now()).length > 0) {
			setPlayerEffects(playerEffects.filter(ps => ps.exp > Date.now()));
		}
	}

	const removePlayerEffect = (playerId, effect) => {
		setPlayerEffects(playerEffects.filter(ps => ps.exp > Date.now()));
	}

	return (
		<div id="LivePlay">

            <Header message={Config.header} />

			<Clock time={gameData.time_seconds} overtime={gameData.isOT} />

            <Footer message="Game 1 of 4" />

            {gameData.teams.map((team, index) => (
                <Fragment key={index}>
                    <TeamName name={team.name} team={index} secondary={index === 1 ? "Testing Franchise Name" : ""} />
                    <TeamScore score={team.score} team={index} />
                </Fragment>
            ))}

            <TeamPlayers players={Object.values(playerData).filter(player => player.team === 0)} team={0} effects={playerEffects} />
            <TeamPlayers players={Object.values(playerData).filter(player => player.team === 1)} team={1} effects={playerEffects} />

            {!gameData.isReplay && gameData.target && playerData.hasOwnProperty(gameData.target) ? (
                <Watching player={playerData[gameData.target]} />
			) : null}

            {!gameData.isReplay && clockRunning ? (
                <Ball ball={gameData.ball} />
			) : null}

            {gameData.isReplay && !gameData.hasWinner && lastGoal.hasOwnProperty("scorer") && lastGoal.scorer.hasOwnProperty("teamnum") ? (
                <Replay lastGoal={lastGoal} />
    		) : null}

		</div>
	)

}

export default Live;
