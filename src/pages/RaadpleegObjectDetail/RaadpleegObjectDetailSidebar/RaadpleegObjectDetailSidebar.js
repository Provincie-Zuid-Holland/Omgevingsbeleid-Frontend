import React from "react"
import BackButton from "../../../components/BackButton"
import RevisieListItem from "./../RevisieListItem"
import Text from "../../../components/Text"
import PopUpRevisionContainer from "../../../components/PopUpRevisionContainer"
import getVigerendText from "../../../utils/getVigerendText"
import { useParams } from "react-router-dom"

const RaadpleegObjectDetailSidebar = ({
    titleSingular,
    dataObject,
    revisionObjects,
}) => {
    let { id } = useParams()
    const vigerendText = getVigerendText({ dataObject, prefix: true })

    return (
        <aside
            id="raadpleeg-detail-container-content"
            className="col-span-6 pt-4 lg:col-span-1 lg:pt-8"
        >
            <BackButton />
            <div>
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Type
                </Text>
                <Text type="span" color="text-pzh-blue-dark" className="block">
                    {titleSingular}
                </Text>
            </div>
            <div className="mt-4">
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Status
                </Text>
                <Text type="span" color="text-pzh-blue-dark" className="block">
                    {vigerendText}
                </Text>
            </div>
            {revisionObjects?.length > 0 ? (
                <div className="mt-4">
                    <Text
                        type="span"
                        className="block font-bold"
                        color="text-pzh-blue-dark"
                    >
                        Revisies
                    </Text>
                    <PopUpRevisionContainer
                        dataObject={dataObject}
                        titleSingular={titleSingular}
                        revisionObjects={revisionObjects}
                    >
                        {revisionObjects.map((item, index) => (
                            <RevisieListItem
                                currentUUID={id}
                                item={item}
                                key={item.UUID}
                            />
                        ))}
                    </PopUpRevisionContainer>
                </div>
            ) : null}
        </aside>
    )
}

export default RaadpleegObjectDetailSidebar
