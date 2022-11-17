import React from 'react';

const TeamName = (props) => {

    const longName = 12;

    return (
        <div className={`teamName ${props.name.length >= longName ? " long" : ""}`} id={`TeamName${props.team}`}>
            {props.name}
        </div>
    )

}

export default TeamName;
