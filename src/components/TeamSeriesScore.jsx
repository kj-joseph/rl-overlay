import React, { Fragment } from "react";

const TeamSeriesScore = (props) => {

    const longScore = 10;

// props.display for display type (numbers / boxes)

    return (
		<Fragment>

			{props.hasOwnProperty("seriesConfig") && props.seriesConfig.hasOwnProperty("display") ?

				<div className={`teamSeriesScore team${props.team} show${props.seriesConfig.display}`}>

					{props.seriesConfig.type === "unlimited" || props.seriesConfig.display === "number" || props.seriesConfig.display === "both" ?

						<div className="number">
							{props.score}
						</div>

					: ""}

					{props.seriesConfig.type !== "unlimited" && (props.seriesConfig.display === "icons" || props.seriesConfig.display === "both") ?
						<div className="icons">
							{[...Array(props.seriesConfig.type === "bestof" ? Math.floor(props.seriesConfig.maxGames / 2) + 1 : props.seriesConfig.maxGames).keys()].map((n) => (
								<span key={n} className={`gameIcon ${n < props.score ? "on" : "off"}`}></span>
							))}
						</div>
					: ""}

				</div>

			: null}
		</Fragment>

    )

}

export default TeamSeriesScore;
