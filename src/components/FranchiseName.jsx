import React from 'react';

const FranchiseName = (props) => {

    const longName = 24;

    return (
        <div className={`franchiseName ${props.name.length >= longName ? " long" : ""}`} id={`FranchiseName${props.team}`}>
            {props.name}
        </div>
    )

}

export default FranchiseName;
