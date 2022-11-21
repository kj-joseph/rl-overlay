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
                .map((event, eventIndex) => (
                    <Fragment key={eventIndex}>
                        {
                            event.name === "Assist" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHandshake} key={eventIndex} />
                            )
                            : event.name === "Dead" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faSkull} key={eventIndex} />
                            )
                            : event.name === "Demolish" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faBomb} key={eventIndex} />
                            )
                            : event.name === "Goal" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faCertificate} key={eventIndex} />
                            )
                            : event.name === "HatTrick" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHatWizard} key={eventIndex} />
                            )
                            : event.name === "Save" || event.name === "EpicSave" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faHand} key={eventIndex} />
                            )
                            : event.name === "Shot" ? (
                                <FontAwesomeIcon className="eventIcon" icon={faFutbol} key={eventIndex} />
                            )


                        : null}


                    </Fragment>
                ))}
        </div>
    )

}

export default PlayerEvents;
