import React from "react";

const SeriesInfo = (props) => {

    let message = "";

    return (
        <div className="seriesInfo">
            {props.config.series.override ? (
                <>
                    {props.config.series.override}
                </>
            ) : props.config.series.type === "none" || props.config.series.type === "unlimited" ? (
                <>
                    {!props.pregame ? `Game ${props.series.game}` : ""}
                </>
            ) : props.config.series.type === "bestof" ? (
                <>
                    {!props.pregame ? (
                        <>
                            Game {props.series.game}<span className="pipe"> | </span>
                        </>
                    ) : null}
                    Best of {props.config.series.maxGames}
                </>
            ) : props.config.series.type === "set" ? (
                <>
                    {!props.pregame ? (
                        <>
                            Game {props.series.game} <span className="small"> of </span>
                        </>
                    ) : null}
                    {props.config.series.maxGames}{props.pregame ? " game series" : ""}
                </>
            ) : null}
        </div>
    )

}

export default SeriesInfo;
