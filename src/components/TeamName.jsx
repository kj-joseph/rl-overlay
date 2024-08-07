import React from "react";

const TeamName = (props) => {

    const longName = 12;

    return (
        <div className={`teamNameScoreboard team${props.team} ${props.name.length >= longName ? " long" : ""}`}>
            {props.name}
        </div>
    )

}

export default TeamName;
