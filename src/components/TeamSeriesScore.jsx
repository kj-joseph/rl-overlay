import React from "react";

const TeamSeriesScore = (props) => {

    const longScore = 10;

// props.display for display type (numbers / boxes)

    return (
        <div className={`teamSeriesScore team${props.team} ${props.score >= longScore ? " long" : ""}`}>
            {props.score}
        </div>
    )

}

export default TeamSeriesScore;
