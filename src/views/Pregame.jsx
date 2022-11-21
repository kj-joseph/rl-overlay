import React, { Fragment, useEffect, useState } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";

import "@/style/pregame.css";

const longTeamName = 16;

const Pregame = (props) => {

	return (
		<div id="Pregame">
            <Header message={props.config.header} />

            {props.config.series.showScore || props.config.series.override ? (
                <SeriesInfo series={props.series} config={props.config} pregame={true} />
            ) : null}

            <div className="vs" data-text="VS">VS</div>
            {props.gameData.teams.map((team, teamnum) => (
                <div className={`team team${teamnum} ${props.config.show.teamLogos && props.config.teams[teamnum].logo && 1 ? "hasLogo" : ""}`} key={`pregameTeam${teamnum}`}>
                    {props.config.show.teamLogos && props.config.teams[teamnum].logo && 1 ? (
                        <div className="logo">
                            <img src={`./src/assets/logos/teams/${props.config.teams[teamnum].logo}`}></img>
                        </div>
                    ) : null }
                    <div className={`name ${team.name.length >= longTeamName ? "long" : ""}`}>{team.name}</div>
                </div>
            ))}
		</div>
	)

}

export default Pregame;
