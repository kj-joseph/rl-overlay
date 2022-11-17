import React from 'react';

import PlayerBox from './PlayerBox';

const TeamPlayers = (props) => {

    return (
        <div className="teamPlayers" id={`TeamPlayers${props.team}`}>
            {Object.values(props.players).map((player, index) => (
                <PlayerBox
                    player={player}
                    teamIndex={props.team}
                    playerIndex={index}
                    key={index}
                    effects={props.effects.filter(p => p.playerId === player.id)}
                    watching={props.watching === player.id}
                />
            ))}

        </div>
    )

}

export default TeamPlayers;
