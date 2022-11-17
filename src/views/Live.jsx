import React, { Fragment } from 'react';

import useWebSocket from 'react-use-websocket';

import Ball from '@/components/Ball';
import Clock from '@/components/Clock';
import Footer from '@/components/Footer';
import FranchiseName from '@/components/FranchiseName';
import Header from '@/components/Header';
import Watching from '@/components/Watching';
import TeamName from '@/components/TeamName';
import TeamPlayers from '@/components/TeamPlayers';
import TeamScore from '@/components/TeamScore';
import Replay from '@/components/Replay';
import TeamSeriesScore from '@/components/TeamSeriesScore';
import Config from "@/data/config.json";

const socketUrl = 'ws://localhost:49322';
let needToSubscribe = false;

const expireEffectInMs = 5000;

const Live = (props) => {

	return (
		<div id="LivePlay">

            <Header message={Config.header} />

			<Clock time={props.gameData.time_seconds} overtime={props.gameData.isOT} />

            <Footer message={Config.footer} />

            {props.gameData.teams.map((team, index) => (
                <Fragment key={index}>
                    <TeamName name={team.name} team={index} />
                    {Config.showFranchise ? (
                        <FranchiseName name={Config.teams[index].franchise} team={index} />
                    ) : null}
                    <TeamScore score={team.score} team={index} />
                    {Config.showSeriesScore ? (
                        <TeamSeriesScore score={Config.teams[index].seriesScore} team={index} />

                    ) : null}

                </Fragment>
            ))}

            <TeamPlayers
                players={Object.values(props.playerData).filter(player => player.team === 0)}
                team={0}
                effects={props.playerEffects}
                watching={!props.gameData.isReplay && props.gameData.target && props.playerData.hasOwnProperty(props.gameData.target) ? props.gameData.target : null}
            />
            <TeamPlayers
                players={Object.values(props.playerData).filter(player => player.team === 1)}
                team={1}
                effects={props.playerEffects}
                watching={!props.gameData.isReplay && props.gameData.target && props.playerData.hasOwnProperty(props.gameData.target) ? props.gameData.target : null}
            />

            {!props.gameData.isReplay && props.gameData.target && props.playerData.hasOwnProperty(props.gameData.target) ? (
                <Watching player={props.playerData[props.gameData.target]} />
			) : null}

            {!props.gameData.isReplay && props.clockRunning ? (
                <Ball ball={props.gameData.ball} />
			) : null}

            <Replay
                lastGoal={props.lastGoal}
                show={props.gameData.isReplay && !props.gameData.hasWinner && props.lastGoal.hasOwnProperty("scorer") && props.lastGoal.scorer.hasOwnProperty("teamnum")}
            />

		</div>
	)

}

export default Live;
