import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const BoostCircle = (props) => {

    return (
        <div className="boostDisplay">
            <CircularProgressbar
                value={props.boost}
                text={props.boost.toString()}
                className="boost"
                circleRatio={.75}
                strokeWidth={12}

                styles={buildStyles({
                    rotation: 0.625,
                    strokeLinecap: "round",
                    pathTransitionDuration: .2,
                })}
            />
        </div>
    )

}

export default BoostCircle;
