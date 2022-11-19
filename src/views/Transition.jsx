import React, { useEffect, useState } from "react";

import "@/style/transition.css";

const Transition = (props) => {

    const [show, setShow] = useState(false);

/*     useEffect(() => {
        console.count("effect");
        console.log(props.transition.show);
        if(props.transition.show) {
            setShow(true);
            // let startDelay = setTimeout(() => {
            //     console.count("transition start");
            //     setShow(true);
            // }, 2000);
            let finishDelay = setTimeout(() => {
                console.count("transition reset");
                setShow(false);
            }, 10000);
        }

        return () => {
            console.count("effect reset");
            // clearTimeout(startDelay);
            // clearTimeout(finishDelay);
            setShow(false);
        }

    }, [props.transition.show])
 */

    return (
        <div id="Transition" className={`${props.transition.class} ${props.transition.show ? "show" : ""}`}>

            <div className="bg">
                {props.transition.logo ? (
                    <div className="logo">
                        <img src={`./src/assets/logos/teams/${props.transition.logo}`}></img>
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
