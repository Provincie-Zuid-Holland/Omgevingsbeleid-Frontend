import React from "react"

import getVigerendText from "../../../utils/getVigerendText"
import PopUpRevisionContainer from "../../../components/PopUpRevisionContainer"
import RevisieListItem from "../RevisieListItem"

/**
 * @returns Component containg a text about the validity of the object and optionally a child component that displays the revisions of the object.
 */
const MetaInfo = ({
    revisionObjects,
    dataObject,
    currentUUID,
    titleSingular,
}) => {
    const vigerendText = getVigerendText({
        dataObject,
        revisionObjects,
        prefix: true,
    })
    const displayRevisionSection = revisionObjects && revisionObjects.length > 0

    return (
        <div className="block mt-2" id="raadpleeg-detail-container-meta-info">
            <span className="mr-3 text-sm text-gray-800 opacity-75">
                {vigerendText}
            </span>

            {displayRevisionSection ? (
                <React.Fragment>
                    <span className="mr-3 text-sm text-gray-600">&bull;</span>
                    <PopUpRevisionContainer
                        dataObject={dataObject}
                        titleSingular={titleSingular}
                        revisionObjects={revisionObjects}
                    >
                        {revisionObjects.map((item, index) => (
                            <RevisieListItem
                                currentUUID={currentUUID}
                                item={item}
                                key={item.UUID}
                            />
                        ))}
                    </PopUpRevisionContainer>
                </React.Fragment>
            ) : null}
        </div>
    )
}

export default MetaInfo
