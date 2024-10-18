import React from "react";

const TeamName = (props) => {

    const longTeamName = 12;
    const longFranchiseName = 25;

    return (
        <div className={`teamNameBox team${props.team}`}>
            <div className={`teamName ${props.name.length >= longTeamName ? "long" : ""} ${props.franchiseName ? "withFranchise" : ""}`}>
				{props.name}
			</div>
			{props.franchiseName ?
	            <div className={`franchiseName ${props.franchiseName.length >= longFranchiseName ? "long" : ""}`}>
					{props.franchiseName}
				</div>
			: ""}
        </div>
    )

}

export default TeamName;
