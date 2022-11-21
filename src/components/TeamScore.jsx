import React from "react";

const TeamScore = (props) => {

    return (
        <div className={`teamScore team${props.team} ${props.long ? " long" : ""}`}>
            {props.score}
        </div>
    )

}

export default TeamScore;
