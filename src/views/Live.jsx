import React, { Fragment, useEffect, useState } from "react";

import Ball from "@/components/Ball";
import Clock from "@/components/Clock";
import SeriesInfo from "@/components/SeriesInfo";
import FranchiseName from "@/components/FranchiseName";
import GameStats from "@/views/GameStats";
import Header from "@/components/Header";
import Replay from "@/components/Replay";
import TeamLogo from "@/components/TeamLogo";
import TeamName from "@/components/TeamName";
import TeamPlayerBoxes from "@/components/TeamPlayerBoxes";
import TeamScore from "@/components/TeamScore";
import TeamSeriesScore from "@/components/TeamSeriesScore";
import Watching from "@/components/Watching";

import "@/style/live.css";
import { config } from "@fortawesome/fontawesome-svg-core";

const longTeamScore = 20;

const Live = (props) => {

    const [longScores, setLongScores] = useState(false);

    useEffect(() => {
        if (props.hasOwnProperty("gameData") && props.gameData.hasOwnProperty("teams") && props.gameData.teams.length > 0) {
            setLongScores(props.gameData.teams[0].score >= longTeamScore || props.gameData.teams[1].score >= longTeamScore);
        }
    });

	return (
		<div id="LivePlay" className={`${props.showGameStats ? "gameStats" : ""}`}>

            <Header message={props.config.header} />

            <Clock time={props.gameData.time_seconds} overtime={props.gameData.isOT} />

            {props.config.show.seriesScore ? (
                <SeriesInfo series={props.series} config={props.config} />
            ) : null}

            {props.gameData.teams.map((team, index) => (
                <Fragment key={index}>
                    <TeamName name={team.name} team={index} />
                    {props.config.show.franchise ? (
                        <FranchiseName name={props.config.teams[index].franchise} team={index} />
                    ) : null}
                    {props.config.show.teamLogos && props.config.teams[index].hasOwnProperty("logo") ? (
                        <TeamLogo team={index} logo={props.config.teams[index].logo} />
                    ) : null}
                    <TeamScore score={team.score} team={index} long={longScores} />
                    {props.config.show.seriesScore ? (
                        <TeamSeriesScore score={props.series.score[index]} team={index} />
                    ) : null}
                </Fragment>
            ))}

            <TeamPlayerBoxes
                players={Object.values(props.playerData).filter(player => player.team === 0)}
                team={0}
                playerEvents={props.playerEvents}
                watching={!props.gameData.isReplay && props.gameData.target && props.playerData.hasOwnProperty(props.gameData.target) ? props.gameData.target : null}
            />
            <TeamPlayerBoxes
                players={Object.values(props.playerData).filter(player => player.team === 1)}
                team={1}
                playerEvents={props.playerEvents}
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
