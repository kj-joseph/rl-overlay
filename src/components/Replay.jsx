import React from 'react';

const Replay = (props) => {

    const kmToMph = 1.6;
    const longPlayerName = 24;
    const speedDecimalPlaces = 1;

    const displayDecimal = (number, places = 0) => {
        return (Math.round(number * 10**places) / 10**places).toFixed(places);
    }

    const goalSpeed = {
        kph: props.lastGoal.goalspeed,
        mph: props.lastGoal.goalspeed / kmToMph,
    }

    return (
        <div id="Replay" className={`team${props.lastGoal.scorer.teamnum}`}>

            <div className="replayLabel replayLabelLeft">REPLAY</div>

            <div className="statLine">
                <div className="stat">
                    <span className="label">Goal</span>
                    <span className={`value ${props.lastGoal.scorer.name >= longPlayerName ? "long" : ""}`}>{props.lastGoal.scorer.name}</span>
                </div>
                {props.lastGoal.assister.name ? (
                    <div className="stat">
                        <span className="label">Assist</span>
                        <span className="value">{props.lastGoal.assister.name}</span>
                    </div>
                ) : null}
                <div className="stat speed">
                    <span className="value">{displayDecimal(goalSpeed.mph, speedDecimalPlaces)}</span>
                    <span className="label">MPH</span>
                    <span className="value">{displayDecimal(goalSpeed.kph, speedDecimalPlaces)}</span>
                    <span className="label">KM/H</span>
                </div>
            </div>

            <div className="replayLabel replayLabelRight">REPLAY</div>

        </div>
    )

}

export default Replay;
