import React from 'react';

import PlayerEffects from './PlayerEffects';

const PlayerBox = (props) => {

    let dead = false;
    const displayStats = [];
    const longPlayerName = 24;
    const statLimit = 2;
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
            label: "D",
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
            id={`Team${props.teamIndex}Player${props.playerIndex}`}
        >

            <div className={`name ${props.player.name.length >= longPlayerName ? "long" : ""}`}>{props.player.name}</div>

            <div className="boost">{props.player.boost}</div>

            <div className="stats">
                {displayStats.map((stat, index) => (
                    <span className="stat" key={index}>
                        {stat.value}<span className="label">{stat.label}</span>
                    </span>

                ))}
            </div>

            <PlayerEffects effects={props.effects} />

        </div>
    )

}

export default PlayerBox;
