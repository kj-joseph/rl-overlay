import React from "react";

const TeamLogo = (props) => {

    return (
        <div className={`teamLogo team${props.team}`}>
            <img src={`/logos/teams/${props.logo}`}></img>
        </div>
    )

}

export default TeamLogo;
