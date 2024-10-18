import React, { Fragment, useEffect, useState } from "react";

import Header from "@/components/Header";
import SeriesInfo from "@/components/SeriesInfo";

const longTeamName = 16;
const longFranchiseName = 25;

const Pregame = (props) => {

	const teamName = (teamnum) => props.config.teams[teamnum].name ? props.config.teams[teamnum].name : props.gameData.teams[teamnum].name;

	return (
		<div id="Pregame" className={`${(props.config.series.show && props.config.series.type !== "unlimited") || props.config.series.override ? "hasSeriesInfo" : ""}`}>

			<div className="pregameHeader">

				<Header headers={props.config.general.headers} />

				{(props.config.series.show && props.config.series.type !== "unlimited") || props.config.series.override ? (
					<SeriesInfo series={props.series} config={props.config} pregame={true} />
				) : null}

			</div>

			<div className="pregameMatchup">

				{JSON.stringify(props.config.teams)}


				{props.gameData.teams.map((team, teamnum) => (
					<Fragment key={`pregameTeam${teamnum}`}>
						<div className={`team team${teamnum} ${props.config.teams[teamnum].hasOwnProperty("logo") && props.config.teams[teamnum].logo ? "hasLogo" : ""}`}>
							{props.config.teams[teamnum].logo ? (
								<div className="logo">
									<img src={`/logos/teams/${props.config.teams[teamnum].logo}`}></img>
								</div>
							) : null }

							<div className="teamText">
								<div className={`name ${teamName(teamnum).length >= longTeamName ? "long" : ""}`}>{teamName(teamnum)}</div>

								{props.config.teams[teamnum].franchise ?
									<div className={`franchise ${props.config.teams[teamnum].franchise.length >= longFranchiseName ? "long" : ""}`}>{props.config.teams[teamnum].franchise}</div>
								: null}
							</div>

						</div>

						{teamnum === 0 ?
							<div className="pregameCenter">
								{props.config.general.brandLogo ?
									<img src={`/logos/${props.config.general.brandLogo}`}></img>
								:
									<div className="vs">VS</div>
								}
							</div>

						: null}

					</Fragment>
				))}

			</div>

		</div>
	)

}

export default Pregame;
