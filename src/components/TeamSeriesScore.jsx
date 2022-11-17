import React from 'react';

const TeamSeriesScore = (props) => {

    const longScore = 10;

    return (
        <div className={`teamSeriesScore ${props.score >= longScore ? " long" : ""}`} id={`TeamSeriesScore${props.team}`}>
            {props.score}
        </div>
    )

}

export default TeamSeriesScore;
