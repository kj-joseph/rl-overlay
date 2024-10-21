import React from "react";

import PlayerEvents from "./PlayerEvents";

const PlayerBox = (props) => {

    let dead = false;
    const displayStats = [];

    const statLimit = 3;
	const eventLimit = 3;
	const longPlayerName = 14;

	const statList = [
        {
            name: "goals",
            label: "G",
        },
        {
            name: "saves",
            label: "SV",
        },
        {
            name: "shots",
            label: "SH",
        },
        {
            name: "demos",
            label: "DM",
        },
    ];

    for (const s of statList) {
        if (props.player[s.name] > 0) {
            displayStats.push({
                label: s.label,
                value: props.player[s.name]
            });
        }
        if (displayStats.length === statLimit) {
            break;
        }
    }

    return (
        <div
			className={`playerBox ${props.watching ? "watching" : ""} ${props.player.isDead ? "dead" : ""}`}
			style={{
				"--playerBoxEventLimit": eventLimit,
			}}
		>

            <div className={`name ${props.player.name.length >= longPlayerName ? "long" : ""}`}>{props.player.name}</div>

            <div className="boost">
				<span className="boostText">{props.player.boost}</span>
				<div className="boostBar">
					<span className="fill" style={{"width": props.player.boost + "%"}}></span>
				</div>
			</div>


			{props.showStats ?
				<div className="stats">
					{displayStats.map((stat, statIndex) => (
						<span className="stat" key={statIndex}>
							{stat.value}<span className="label">{stat.label}</span>
						</span>

					))}
				</div>
			: ""}

            <PlayerEvents events={props.playerEvents} limit={eventLimit} />

        </div>
    )

}

export default PlayerBox;
