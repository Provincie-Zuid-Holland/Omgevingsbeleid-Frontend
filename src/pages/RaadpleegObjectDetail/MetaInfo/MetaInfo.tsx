import { PopUpRevisionContainer } from '@/components/Popup'
import getVigerendText from '@/utils/getVigerendText'

import RevisieListItem from '../RevisieListItem'

/**
 * @returns Component containg a text about the validity of the object and optionally a child component that displays the revisions of the object.
 */

interface MetaInfoProps {
    revisionObjects?: any[]
    dataObject: any
    currentUUID: string
    titleSingular: string
}

const MetaInfo = ({
    revisionObjects,
    dataObject,
    currentUUID,
    titleSingular,
}: MetaInfoProps) => {
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

            {displayRevisionSection && (
                <>
                    <span className="mr-3 text-sm text-gray-600">&bull;</span>
                    <PopUpRevisionContainer
                        dataObject={dataObject}
                        titleSingular={titleSingular}
                        revisionObjects={revisionObjects}>
                        {revisionObjects.map(item => (
                            <RevisieListItem
                                currentUUID={currentUUID}
                                item={item}
                                key={item.UUID}
                            />
                        ))}
                    </PopUpRevisionContainer>
                </>
            )}
        </div>
    )
}

export default MetaInfo