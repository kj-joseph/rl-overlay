import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBomb,
    faCertificate,
    faFutbol,
    faHand,
    faHandshake,
    faHatWizard,
    faSkull,
} from '@fortawesome/free-solid-svg-icons'

const effectsLimit = 2;
const icons = {
    Shot: "faFutbol",
}
// const icons = {
//     Shot: <FontAwesomeIcon className="effectIcon" icon={faFutbol} />,

// };



const PlayerEffects = (props) => {


    return (
        <div className="effects">
            {props.effects.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
                .filter((e, i) => i < effectsLimit)
                .map((effect, index) => (
                    <Fragment key={index}>
                        {
                            effect.effect === "Assist" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faHandshake} key={index} />
                            )
                            : effect.effect === "Dead" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faSkull} key={index} />
                            )
                            : effect.effect === "Demolish" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faBomb} key={index} />
                            )
                            : effect.effect === "Goal" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faCertificate} key={index} />
                            )
                            : effect.effect === "HatTrick" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faHatWizard} key={index} />
                            )
                            : effect.effect === "Save" || effect.effect === "EpicSave" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faHand} key={index} />
                            )
                            : effect.effect === "Shot" ? (
                                <FontAwesomeIcon className="effectIcon" icon={faFutbol} key={index} />
                            )


                        : null}


                    </Fragment>
                ))}
        </div>
    )

}

export default PlayerEffects;
