import React from "react";

const TeamScore = (props) => {

    return (
        <div className={`teamScoreScoreboard team${props.team} ${props.long ? " long" : ""}`}>
            {props.score}
        </div>
    )

}

export default TeamScore;
