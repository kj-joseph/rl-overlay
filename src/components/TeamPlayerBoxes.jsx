import React from "react";

import PlayerBox from "./PlayerBox";

const TeamPlayers = (props) => {

    return (
        <div className="teamPlayerBoxes" id={`Team${props.team}PlayerBoxes`}>
            {Object.values(props.players).map((player, playerIndex) => (
                <PlayerBox
                    player={player}
                    teamIndex={props.team}
                    playerIndex={playerIndex}
                    key={playerIndex}
                    playerEvents={props.playerEvents.filter(p => p.playerId === player.id)}
                    watching={props.watching === player.id}
                />
            ))}

        </div>
    )

}

export default TeamPlayers;
