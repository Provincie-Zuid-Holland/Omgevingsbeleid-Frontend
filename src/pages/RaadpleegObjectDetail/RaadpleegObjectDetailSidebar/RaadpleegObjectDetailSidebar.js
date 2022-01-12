import { useParams } from 'react-router-dom'

import BackButton from '../../../components/BackButton'
import PopUpRevisionContainer from '../../../components/PopUpRevisionContainer'
import Text from '../../../components/Text'
import getVigerendText from '../../../utils/getVigerendText'
import RevisieListItem from './../RevisieListItem'

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
            className="col-span-6 pt-4 xl:col-span-1 xl:pt-8">
            <BackButton className="hidden xl:block" />
            <div className="flex justify-between xl:block">
                <div className="hidden xl:block">
                    <Text
                        type="span"
                        className="block font-bold"
                        color="text-pzh-blue-dark">
                        Type
                    </Text>
                    <Text
                        type="span"
                        color="text-pzh-blue-dark"
                        className="block">
                        {titleSingular}
                    </Text>
                </div>
                <div className="mt-4 sm:mt-0 xl:mt-4">
                    <Text
                        type="span"
                        className="hidden block font-bold xl:block"
                        color="text-pzh-blue-dark">
                        Status
                    </Text>
                    <Text
                        type="span"
                        color="text-pzh-blue-dark"
                        className="block">
                        {vigerendText}
                    </Text>
                </div>
                {revisionObjects?.length > 0 ? (
                    <div className="text-right xl:mt-4 xl:text-left">
                        <Text
                            type="span"
                            className="hidden block font-bold xl:block"
                            color="text-pzh-blue-dark">
                            Revisies
                        </Text>
                        <PopUpRevisionContainer
                            dataObject={dataObject}
                            titleSingular={titleSingular}
                            revisionObjects={revisionObjects}>
                            {revisionObjects.map(item => (
                                <RevisieListItem
                                    currentUUID={id}
                                    item={item}
                                    key={item.UUID}
                                />
                            ))}
                        </PopUpRevisionContainer>
                    </div>
                ) : null}
            </div>
        </aside>
    )
}

export default RaadpleegObjectDetailSidebar
