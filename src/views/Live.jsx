import React, { Fragment, useEffect, useState } from "react";

import Ball from "@/components/Ball";
import Clock from "@/components/Clock";
import Footer from "@/components/Footer";
import FranchiseName from "@/components/FranchiseName";
import Header from "@/components/Header";
import Watching from "@/components/Watching";
import TeamLogo from "@/components/TeamLogo";
import TeamName from "@/components/TeamName";
import TeamPlayerBoxes from "@/components/TeamPlayerBoxes";
import TeamScore from "@/components/TeamScore";
import Replay from "@/components/Replay";
import TeamSeriesScore from "@/components/TeamSeriesScore";
import Config from "@/data/config.json";

import "@/style/live/main.css";

const longTeamScore = 29;

const Live = (props) => {

    const [longScores, setLongScores] = useState(false);

    useEffect(() => {
        if (props.hasOwnProperty("gameData") && props.gameData.hasOwnProperty("teams") && props.gameData.teams.length > 0) {
            setLongScores(props.gameData.teams[0].score >= longTeamScore || props.gameData.teams[1].score >= longTeamScore);
        }
    });

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
                    {Config.showLogos && Config.teams[index].hasOwnProperty("logo") ? (
                        <TeamLogo team={index} logo={Config.teams[index].logo} />
                    ) : null}
                    <TeamScore score={team.score} team={index} long={longScores} />
                    {Config.showSeriesScore ? (
                        <TeamSeriesScore score={Config.teams[index].seriesScore} team={index} />

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
