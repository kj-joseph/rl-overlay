import React from "react";

const SeriesInfo = (props) => {

    let message = "";

    return (
        <div className="seriesInfo">
            {props.seriesConfig.override ? (
                <>
                    {props.seriesConfig.override}
                </>
            ) : props.seriesConfig.type === "none" || props.seriesConfig.type === "unlimited" ? (
                <>
                    {!props.pregame ? `Game ${props.seriesGame}` : ""}
                </>
            ) : props.seriesConfig.type === "bestof" ? (
                <>
                    {!props.pregame ? (
                        <>
                            Game {props.seriesGame}<span className="pipe"> | </span>
                        </>
                    ) : null}
                    Best of {props.seriesConfig.maxGames}
                </>
            ) : props.seriesConfig.type === "set" ? (
                <>
                    {!props.pregame ? (
                        <>
                            Game {props.seriesGame} <span className="small"> of </span>
                        </>
                    ) : null}
                    {props.seriesConfig.maxGames}{props.pregame ? " game series" : ""}
                </>
            ) : null}
        </div>
    )

}

export default SeriesInfo;
