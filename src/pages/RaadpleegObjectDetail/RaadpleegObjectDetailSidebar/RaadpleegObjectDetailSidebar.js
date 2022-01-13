import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import { useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useClickAway } from 'react-use'
import 'tippy.js/dist/tippy.css'

import BackButton from '../../../components/BackButton'
import { PopUpRevisionContainer } from '../../../components/Popup'
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
                    <Status status={dataObject.Status} />
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

const Status = ({ status = '' }) => {
    const [tippyOpen, setTippyOpen] = useState(false)
    const innerContainer = useRef(null)

    useClickAway(innerContainer, () => {
        setTippyOpen(false)
    })

    return (
        <span onClick={() => setTippyOpen(!tippyOpen)}>
            <Tippy
                ref={innerContainer}
                placement="left"
                visible={tippyOpen}
                content={
                    <Link
                        onClick={() => setTippyOpen(false)}
                        className="text-sm pointer-events-auto"
                        to="/in-bewerking#besluitvormingsproces">
                        <span className="block font-bold">
                            Huidige status: {status}
                        </span>
                        <span className="block">
                            Bekijk de uitleg en betekenis van statussen{' '}
                            <span className="underline">hier</span>
                        </span>
                    </Link>
                }>
                <div className="hidden xl:inline group">
                    <Text
                        type="span"
                        className="font-bold"
                        color="text-pzh-blue-dark">
                        Status
                    </Text>
                    <div className="inline-block ml-1 transition-colors duration-500 ease-in cursor-pointer text-pzh-dark-blue opacity-40 group-hover:opacity-80">
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </Tippy>
        </span>
    )
}

export default RaadpleegObjectDetailSidebar
