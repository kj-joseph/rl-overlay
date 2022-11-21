import React from "react";

const Ball = (props) => {

    const kmToMph = 1.6;
    const speedDecimalPlaces = 1;

    const displayDecimal = (number, places = 0) => {
        return (Math.round(number * 10**places) / 10**places).toFixed(places);
    }

    const ballSpeed = {
        kph: props.ball.speed,
        mph: props.ball.speed / kmToMph,
    }

    return (
        <div className="ball">

            <div className="name">Ball</div>
            <div className="statLine">
                <div className="stat">
                    <span className="value">{displayDecimal(ballSpeed.mph, speedDecimalPlaces)}</span>
                    <span className="label">MPH</span>
                </div>
                <div className="stat">
                    <span className="value">{displayDecimal(ballSpeed.kph, speedDecimalPlaces)}</span>
                    <span className="label">KM/H</span>
                </div>
            </div>

        </div>
    )

}

export default Ball;
