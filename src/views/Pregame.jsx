import React, { Fragment, useEffect, useState } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";

import "@/style/rsc/pregame.css";

const longTeamName = 16;

const Pregame = (props) => {

	const teamName = (teamnum) => props.config.teams[teamnum].name ? props.config.teams[teamnum].name : props.gameData.teams[teamnum].name;

	return (
		<div id="Pregame">
            <Header headers={props.config.general.headers} />

            {props.config.series.show || props.config.series.override ? (
                <SeriesInfo series={props.series} config={props.config} pregame={true} />
            ) : null}

            <div className="vs" data-text="VS">VS</div>
            {props.gameData.teams.map((team, teamnum) => (
                <div className={`team team${teamnum} ${props.config.teams[teamnum].hasOwnProperty("logo") && props.config.teams[teamnum].logo ? "hasLogo" : ""}`} key={`pregameTeam${teamnum}`}>
                    {props.config.teams[teamnum].logo ? (
                        <div className="logo">
                            <img src={`/logos/teams/${props.config.teams[teamnum].logo}`}></img>
                        </div>
                    ) : null }
                    <div className={`name ${teamName(teamnum).length >= longTeamName ? "long" : ""}`}>{teamName(teamnum)}</div>
                </div>
            ))}
		</div>
	)

}

export default Pregame;
