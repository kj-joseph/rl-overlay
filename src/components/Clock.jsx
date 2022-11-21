import React from "react";

const Clock = (props) => {

    const minutes = Math.floor(props.time / 60);
    const seconds = props.time - minutes * 60;
    const displayTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    const longTimeMinutes = 100;
    const longTimeMinutesOT = 20;

    return (
        <div className={`clock ${props.overtime ? "overtime" : ""}`}>
            <div className={`time ${minutes >= longTimeMinutes || (props.overtime && minutes >= longTimeMinutesOT) ? "long" : ""}`}>
                {props.overtime ? (
                    <span className="plus">+</span>
                ) : null}
                {displayTime}</div>
            {props.overtime ? (
                <div className="overtimeText">OVERTIME</div>
            ) : null}
        </div>
    )

}

export default Clock;
