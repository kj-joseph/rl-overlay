import React from 'react';

const TeamName = (props) => {

    const longName = 12;

    return (
        <div className={`teamName teambg${props.team}`} id={`TeamName${props.team}`}>
            <div className={`name ${props.name.length >= longName ? " long" : ""} ${props.secondary ? " hasSecondary" : ""}`}>
                {props.name}
            </div>
            {props.secondary ? (
                <div className="secondary">{props.secondary}</div>
            ) : null}
        </div>
    )

}

export default TeamName;
