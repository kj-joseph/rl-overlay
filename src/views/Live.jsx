import React, { Fragment, useState } from 'react';

import Ball from '@/components/Ball';
import Clock from '@/components/Clock';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Watching from '@/components/Watching';
import TeamName from '@/components/TeamName';
import TeamPlayers from '@/components/TeamPlayers';
import TeamScore from '@/components/TeamScore';
import Replay from '@/components/Replay';


const Live = (props) => {
	const [showingReplay, setShowingReplay] = useState(false);

	return (
		<div id="LivePlay">

            <Header message="RSC Season 16 | Amateur | Round 1" />

			<Clock time={props.gameData.time_seconds} overtime={props.gameData.isOT} />

            <Footer message="Game 1 of 4" />

            {props.gameData.teams.map((team, index) => (
                <Fragment key={index}>
                    <TeamName name={team.name} team={index} secondary={index === 1 ? "Testing Franchise Name" : ""} />
                    <TeamScore score={team.score} team={index} />
                </Fragment>
            ))}

            <TeamPlayers players={Object.values(props.playerData).filter(player => player.team === 0)} team={0} effects={props.playerEffects} />
            <TeamPlayers players={Object.values(props.playerData).filter(player => player.team === 1)} team={1} effects={props.playerEffects} />

			{0 ? (
				<div id="DataTest">
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    replay: {props.gameData.isReplay.toString()}<br />

                    ++++++<br />
                    {0 ? props.playerEffects.map((ps, i) => (
                        <div key={i}>
                            {ps.playerId} - {ps.effect}: {ps.exp - Date.now()}
                            </div>
                    )) : null}
                    ++++++<br />
				</div>
			) : null}

            {!props.gameData.isReplay && props.gameData.target && props.playerData.hasOwnProperty(props.gameData.target) ? (
                <Watching player={props.playerData[props.gameData.target]} />
			) : null}

            {!props.gameData.isReplay && props.clockRunning ? (
                <Ball ball={props.gameData.ball} />
			) : null}

            {props.gameData.isReplay && !props.gameData.hasWinner && props.lastGoal.hasOwnProperty("scorer") && props.lastGoal.scorer.hasOwnProperty("teamnum") ? (
                <Replay lastGoal={props.lastGoal} />
    		) : null}

		</div>
	)
}

export default Live;
