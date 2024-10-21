import React, { Fragment, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

import SeriesInfo from "@/components/SeriesInfo";
import Header from "@/components/Header";
import TeamLogo from "@/components/TeamLogo";
import TeamName from "@/components/TeamName";
import TeamScore from "@/components/TeamScore";
import TeamSeriesScore from "@/components/TeamSeriesScore";

const longPlayerName = 16;
const longTeamScore = 20;
const statList = [
    {
        name: "score",
        label: "Score",
    },
    {
        name: "goals",
        label: "Goals",
    },
    {
        name: "assists",
        label: "Assists",
    },
    {
        name: "saves",
        label: "Saves",
    },
    {
        name: "shots",
        label: "Shots",
    },
    {
        name: "demos",
        label: "Demos",
    },
    {
        name: "touches",
        label: "Touches",
    },
];

const Postgame = (props) => {

    let longScores = false;
    if (props.hasOwnProperty("gameData") && props.gameData.hasOwnProperty("teams") && props.gameData.teams.length > 0) {
        longScores = props.gameData.teams[0].score >= longTeamScore || props.gameData.teams[1].score >= longTeamScore;
    }

    const winningTeam = props.gameData.teams[0].score > props.gameData.teams[1].score ? 0 : 1;

    const getSortedTeamPlayers = (team) => Object.values(props.players)
        .filter(p => p.team === team)
        .sort((a, b) => parseInt(a.score) < parseInt(b.score) ? 1 : parseInt(a.score) > parseInt(b.score) ? -1 : 1)
    const teams = [];

    for (let t = 0; t <= 1; t++) {
        teams[t] = getSortedTeamPlayers(t);
    }

	return (
		<div className="postgame">

			<div className="clock"><div className="time long">FINAL</div></div>

            <Header headers={props.config.general.headers} />

            {props.config.series.show || props.config.series.override ? (
                <SeriesInfo series={props.series} config={props.config} />
            ) : null}

            {props.gameData.teams.map((team, teamnum) => (
                <Fragment key={teamnum}>

                    <TeamName name={props.config.teams[teamnum].name ? props.config.teams[teamnum].name : team.name} team={teamnum} franchiseName={props.config.teams[teamnum].franchise} />

                    {props.config.teams[teamnum].hasOwnProperty("logo") && props.config.teams[teamnum].logo ? (
                        <TeamLogo team={teamnum} logo={props.config.teams[teamnum].logo} />
                    ) : null}

                    <TeamScore score={team.score} team={teamnum} long={longScores} />

                    {props.config.series.show ? (
                        <TeamSeriesScore score={props.series.score[teamnum]} seriesConfig={props.config.series} team={teamnum} />
                    ) : null}

                </Fragment>
            ))}

			{props.config.general.hasOwnProperty("brandLogo") && props.config.general.brandLogo ?

				<div className="branding">
					<div className="brandLogo">
						<img src={`/logos/${props.config.general.brandLogo}`}></img>
					</div>
					<div className="brandLogo">
						<img src={`/logos/${props.config.general.brandLogo}`}></img>
					</div>
				</div>

			: null }



            <div className="title">Game Stats</div>

            <table className="statTable">
                <thead>
                    <tr>
                        {teams[0].map((player, playerIndex) => (
                            <th className={`playerName team0 ${player.name.length > longPlayerName ? "long" : ""}`} key={`team0player${playerIndex}`}>
                                {winningTeam === 0 && playerIndex === 0 ? (
									<ReactSVG className="mvpIcon" src="/eventIcons/mvp.svg" />
                                ) : null}
								<span>{player.name}</span>
                            </th>
                        ))}
                        <th className="centerColumn"></th>
                        {teams[1].map((player, playerIndex) => (
                            <th className={`playerName team1 ${player.name.length > longPlayerName ? "long" : ""}`} key={`team1player${playerIndex}`}>
                                {winningTeam === 1 && playerIndex === 0 ? (
									<ReactSVG className="mvpIcon" src="/eventIcons/mvp.svg" />
                                ) : null}
								<span>{player.name}</span>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {statList.map((stat, statIndex) => (
                        <tr key={`stat${statIndex}`}>
                            {teams[0].map((player, playerIndex) => (
                                <td className={`playerName ${winningTeam === 0 && playerIndex === 0 ? "mvp" : ""}`} key={`team0player${playerIndex}stat${statIndex}`}>
                                    {player[stat.name]}
                                </td>
                            ))}
                            <th scope="row" className="centerColumn">{stat.label}</th>
                            {teams[1].map((player, playerIndex) => (
                                <td className={`playerName ${winningTeam === 1 && playerIndex === 1 ? "mvp" : ""}`} key={`team1player${playerIndex}stat${statIndex}`}>
                                    {player[stat.name]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>



            </table>
		</div>

	)

}

export default Postgame;
