import React, { Fragment } from "react";

import Ball from "@/components/Ball";
import Clock from "@/components/Clock";
import SeriesInfo from "@/components/SeriesInfo";
import FranchiseName from "@/components/FranchiseName";
import Header from "@/components/Header";
import Replay from "@/components/Replay";
import TeamLogo from "@/components/TeamLogo";
import TeamName from "@/components/TeamName";
import TeamPlayerBoxes from "@/components/TeamPlayerBoxes";
import TeamScore from "@/components/TeamScore";
import TeamSeriesScore from "@/components/TeamSeriesScore";
import Watching from "@/components/Watching";

import "@/style/rsc/live.css";

const longTeamScore = 20;

const Live = (props) => {

    const longScores = props.hasOwnProperty("gameData")
        && props.gameData.hasOwnProperty("teams")
        && props.gameData.teams.length > 0
        && (props.gameData.teams[0].score >= longTeamScore
            || props.gameData.teams[1].score)
        ? true : false;

	return (
		<div id="LivePlay">

            <Header message={props.config.header} />

            <Clock time={props.gameData.time_seconds} overtime={props.gameData.isOT} />

            {props.config.series.showScore || props.config.series.override ? (
                <SeriesInfo series={props.series} config={props.config} />
            ) : null}

            {props.gameData.teams.map((team, teamnum) => (
                <Fragment key={teamnum}>
                    <TeamName name={team.name} team={teamnum} />
                    {props.config.show.franchise ? (
                        <FranchiseName name={props.config.teams[teamnum].franchise} team={teamnum} />
                    ) : null}
                    {props.config.show.teamLogos && props.config.teams[teamnum].hasOwnProperty("logo") ? (
                        <TeamLogo team={teamnum} logo={props.config.teams[teamnum].logo} />
                    ) : null}
                    <TeamScore score={team.score} team={teamnum} long={longScores} />
                    {props.config.series.showScore ? (
                        <TeamSeriesScore score={props.series.score[teamnum]} team={teamnum} />
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
