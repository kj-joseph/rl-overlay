import React from 'react';

const Clock = (props) => {

    const minutes = Math.floor(props.time / 60);
    const seconds = props.time - minutes * 60;
    const displayTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    const longTimeMinutes = 20;

    return (
        <div id="Clock" className={`${props.overtime ? "overtime" : ""}`}>
            <div className={`time ${minutes >= longTimeMinutes ? "long" : ""}`}><span className="plus">{props.overtime ? "+" : ""}</span>{displayTime}</div>
            {props.overtime ? (
                <div className="overtimeText">OVERTIME</div>
            ) : null}
        </div>
    )

}

export default Clock;
