import React from "react";
import BoostCircle from "./BoostCircle";

const Watching = (props) => {

    const longName = 30;

    return (
        <div className={`watching watchingTeam${props.player.team}`} id="Watching">

            <div className="stats">
                <div className={`name ${props.player.name.length >= longName ? " long" : ""}`}>{props.player.name}</div>
                <div className="statLine">
                    <div className="stat">
                        <span className="label">G</span>
                        <span className="value">{props.player.goals}</span>
                    </div>
                    <div className="stat">
                        <span className="label">A</span>
                        <span className="value">{props.player.assists}</span>
                    </div>
                    <div className="stat">
                        <span className="label">SH</span>
                        <span className="value">{props.player.shots}</span>
                    </div>
                    <div className="stat">
                        <span className="label">SV</span>
                        <span className="value">{props.player.saves}</span>
                    </div>
                    <div className="stat">
                        <span className="label">D</span>
                        <span className="value">{props.player.demos}</span>
                    </div>
                    <div className="stat">
                        <span className="label">T</span>
                        <span className="value">{props.player.touches}</span>
                    </div>
                </div>
            </div>

            <BoostCircle boost={props.player.boost} />

        </div>
    )

}

export default Watching;
