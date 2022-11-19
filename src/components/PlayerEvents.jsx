import React, { Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBomb,
    faCertificate,
    faFutbol,
    faHand,
    faHandshake,
    faHatWizard,
    faSkull,
} from "@fortawesome/free-solid-svg-icons";

const eventLimit = 2;

const PlayerEvents = (props) => {

    return (
        <div className="events">
            {props.events.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
                .filter((e, i) => i < eventLimit)
                .map((event, index) => (
                    <Fragment key={index}>
                        {
                            event.name === "Assist" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHandshake} key={index} />
                            )
                            : event.name === "Dead" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faSkull} key={index} />
                            )
                            : event.name === "Demolish" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faBomb} key={index} />
                            )
                            : event.name === "Goal" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faCertificate} key={index} />
                            )
                            : event.name === "HatTrick" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHatWizard} key={index} />
                            )
                            : event.name === "Save" || event.name === "EpicSave" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHand} key={index} />
                            )
                            : event.name === "Shot" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faFutbol} key={index} />
                            )


                        : null}


                    </Fragment>
                ))}
        </div>
    )

}

export default PlayerEvents;
