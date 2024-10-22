import React from "react";

const Transition = (props) => {

    return (
        <div id="Transition" className={`${props.transition.styleClass} ${props.transition.show ? "show" : ""}`}>

            <div className="bg">
                {props.transition.logo ? (
                    <div className="logo">
                        <img src={`/logos/${props.transition.logo}`}></img>
                    </div>
                ): null}
            </div>
            <div className="stripe">
                {props.transition.text ? (
                    <div className="text">{props.transition.text}</div>
                ) : null}
            </div>

        </div>
    )

}

export default Transition;
