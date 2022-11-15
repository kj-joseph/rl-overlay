import React from 'react';

const Clock = (props) => {

    const minutes = Math.floor(props.time / 60);
    const seconds = props.time - minutes * 60;
    const displayTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`

    return (
        <div id="Clock" className={`${props.overtime ? "overtime" : ""}`}>
            <div className={`time ${minutes > 9 ? "long" : ""}`}><span className="plus">{props.overtime ? "+" : ""}</span>{displayTime}</div>
        </div>

        // TODO: separate items?
        // <div id="Clock" className={`${props.overtime ? "overtime" : ""} ${minutes > 9 ? "long" : ""}`}>
        //     {props.overtime ? "+" : ""}
        //     <div className="minutes">{minutes < 1 ? "0" : minutes}</div>
        //     <div className="separator">:</div>
        //     <div className="seconds">{seconds < 10 ? "0" : ""}{seconds}</div>
        // </div>

    )

}

export default Clock;
