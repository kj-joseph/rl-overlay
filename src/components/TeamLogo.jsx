import React from 'react';

const TeamLogo = (props) => {

    return (
        <div className="teamLogo" id={`TeamLogo${props.team}`}>
            <img src={`./src/assets/logos/teams/${props.logo}`}></img>
        </div>
    )

}

export default TeamLogo;
