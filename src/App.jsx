import React, { useState } from 'react';

import useWebSocket from 'react-use-websocket';

import Live from '@/views/Live';

let needToSubscribe = false;
const expireEventsInMs = 5000;
const socketUrl = 'ws://localhost:49322';

const App = () => {

    const [clockRunning, setClockRunning] = useState(false);
	const [gameData, setGameData] = useState({
		teams: [],
		time_seconds: 0,
	});
	const [lastGoal, setLastGoal] = useState({});
	const [playerData, setPlayerData] = useState({});
	const [playerEvents, setPlayerEvents] = useState([]);

	const {
	  sendMessage,
	  sendJsonMessage,
	  lastMessage,
	  lastJsonMessage,
	  readyState,
	  getWebSocket,
	} = useWebSocket(socketUrl, {
	  onOpen: () => subscribeToFeed(),
	  onMessage: (msg) => handleData(msg.data),
	  //Will attempt to reconnect on all close events, such as server shutting down
	  shouldReconnect: (closeEvent) => true,
	});

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

                    // for (const x in data.players) {
                    //     data.players[x].name = data.players[x].name + " " + data.players[x].name + " " + data.players[x].name + " " + data.players[x].name
                    // }


					setPlayerData(data.players);
				}
				if (data.hasOwnProperty("game")) {
                    expirePlayerEvents();
					setGameData(data.game);
				}
				break;

		}

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

	return (
		<div className="App">
			<Live
                clockRunning={clockRunning}
                gameData={gameData}
                lastGoal={lastGoal}
                playerData={playerData}
                playerEvents={playerEvents}
            />
		</div>
	)

}

export default App;
