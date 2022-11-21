import React from "react";

const FranchiseName = (props) => {

    const longName = 24;

    return (
        <div className={`franchiseName franchiseName${props.team} ${props.name.length >= longName ? " long" : ""}`}>
            {props.name}
        </div>
    )

}

export default FranchiseName;
