import React from 'react';

import Player from './Player';

const TeamPlayers = (props) => {

    return (
        <div className="teamPlayers" id={`teamPlayers${props.team}`}>
            {Object.values(props.players).map((player, index) => (
                <Player
                    player={player}
                    teamIndex={props.team}
                    playerIndex={index}
                    key={index}
                    effects={props.effects.filter(p => p.playerId === player.id)}
                />
            ))}

        </div>
    )

}

export default TeamPlayers;
