import React from "react";

const SeriesInfo = (props) => {

    let message = "";

    if (props.config.series.override) {
        message = props.config.series.override;
    } else {

        switch(props.config.series.type) {
            case "none":
                message = `Game ${props.series.game}`;
                break;
            case "bestof":
                message = `Game ${props.series.game} | Best of ${props.config.series.maxGames}`;
                break;
            case "set":
                message = `Game ${props.series.game} of ${props.config.series.maxGames}`;
                break;
            default:
                message = "";
        }

    }

    return (
        <div id="SeriesInfo">
            {props.config.series.override ? (
                <>
                    {props.config.series.override}
                </>
            ) : props.config.series.type === "none" ? (
                <>
                    Game {props.series.game}
                </>
            ) : props.config.series.type === "bestof" ? (
                <>
                    Game {props.series.game} <span className="pipe">|</span> <span className="small">Best of {props.config.series.maxGames}</span>
                </>
            ) : props.config.series.type === "set" ? (
                <>
                    Game {props.series.game} <span className="small">of</span> {props.config.series.maxGames}
                </>
            ) : null}
        </div>
    )

}

export default SeriesInfo;
