import React from "react";

const TeamScore = (props) => {

    return (
        <div className={`teamScore ${props.long ? " long" : ""}`} id={`TeamScore${props.team}`}>
            {props.score}
        </div>
    )

}

export default TeamScore;
