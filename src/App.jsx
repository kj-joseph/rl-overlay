import React, { useEffect, useState } from 'react';

import useWebSocket from 'react-use-websocket';

import Live from '@/views/Live';

let needToSubscribe = false;
const expireEffectInMs = 5000;
const socketUrl = 'ws://localhost:49322';

const App = () => {

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
                            clearPlayerEffects(data.secondary_target.id);
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

                    // for (const x in data.players) {
                    //     data.players[x].name = data.players[x].name + " " + data.players[x].name + " " + data.players[x].name + " " + data.players[x].name
                    // }


					setPlayerData(data.players);
				}
				if (data.hasOwnProperty("game")) {
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
		<div className="App">
			<Live
                clockRunning={clockRunning}
                gameData={gameData}
                lastGoal={lastGoal}
                playerData={playerData}
                playerEffects={playerEffects}
            />
		</div>
	)

}

export default App;
