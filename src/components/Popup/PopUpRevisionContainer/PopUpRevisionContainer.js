import { faHistory } from '@fortawesome/pro-light-svg-icons'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Heading from '../../Heading'
import Modal from '../../Modal'
import PopupRevisionOverview from './../PopupRevisionOverview'

/**
 * Displays revisions in a timeline form and a overview of revisions.
 *
 * @param {string} titleSingular - Title of the object in a singular form
 * @param {object} dataObject - Parameter containing the object data.
 * @param {array} revisionObjects - Parameter containing a list of revisionObjects.
 * @param {object} children - Can contain child component(s).
 */
const PopUpRevisionContainer = ({
    titleSingular,
    dataObject,
    revisionObjects,
    children,
}) => {
    const [open, setOpen] = useState(false)
    const [revisionOverviewOpen, setRevisionOverviewOpen] = useState(false)
    const amountOfRevisions = revisionObjects ? revisionObjects.length : 0

    let { id } = useParams()

    useEffect(() => {
        setOpen(false)
    }, [id])

    const getAmountText = amountOfRevisions => {
        if (amountOfRevisions === 1) return 'Geen revisies'
        return amountOfRevisions + ' revisies'
    }

    return (
        <div className="relative inline-block">
            <div className="z-10 inline-block text-pzh-blue-dark">
                <span
                    onClick={() => {
                        if (amountOfRevisions > 1) {
                            setOpen(!open)
                        }
                    }}
                    className={`${
                        amountOfRevisions > 1 ? 'cursor-pointer' : ''
                    } select-none flex items-center group`}>
                    <FontAwesomeIcon
                        className="mr-2 -mt-1 text-base "
                        icon={faHistory}
                    />
                    <span
                        className={
                            amountOfRevisions > 1
                                ? 'underline group-hover:text-pzh-green-dark transition-colors duration-300 ease-in text-pzh-green'
                                : ''
                        }>
                        {getAmountText(amountOfRevisions)}
                    </span>
                </span>
            </div>
            <div className="absolute top-0 left-0 z-50 inline-block mt-6">
                <PopupRevisionTimeline
                    open={open}
                    setOpen={setOpen}
                    setRevisionOverviewOpen={setRevisionOverviewOpen}
                    titleSingular={titleSingular}
                    revisionObjects={revisionObjects}
                    revisionListItems={children}
                />
                <PopupRevisionOverview
                    dataObject={dataObject}
                    revisionObjects={revisionObjects}
                    revisionOverviewOpen={revisionOverviewOpen}
                    setRevisionOverviewOpen={setRevisionOverviewOpen}
                />
            </div>
        </div>
    )
}

/**
 * Component which renders the PopupRevisionTimeline component, which displays a popup containing the revisions in a timeline form, which the user can filter on.
 *
 * @component
 *
 * @param {boolean} open - Parameter used to display the Transition component.
 * @param {array} revisionListItems - Parameter containing a list of revision list items.
 * @param {function} setOpen - Function to close the revision timeline popup.
 * @param {function} setRevisionOverviewOpen - Function to edit parent state
 * @param {string} titleSingular - Title of the object in a singular form
 * @param {array} revisionObjects - Parameter containing a list of revision in object form.
 */
const PopupRevisionTimeline = ({
    open,
    revisionListItems,
    setOpen,
    setRevisionOverviewOpen,
    titleSingular,
    revisionObjects,
}) => {
    return (
        <Modal
            open={open}
            close={() => setOpen(false)}
            maxWidth="max-w-sm"
            containerPadding="p-0">
            <div>
                <div className="p-6 pb-0">
                    <Heading level="3" color="text-pzh-blue-dark">
                        Versies van dit beleid
                    </Heading>
                </div>
                <div
                    className="relative h-full pl-6 mt-3 overflow-y-auto"
                    style={{ maxHeight: '50vh' }}>
                    <div
                        className="absolute top-0 z-0 w-1 h-full ml-5 border-l border-gray-300"
                        style={{ height: 'calc(100% - 25px)', top: '25px' }}
                    />
                    <ul className="pl-5">{revisionListItems}</ul>
                </div>

                {titleSingular === 'Beleidskeuze' &&
                revisionObjects &&
                revisionObjects.length > 1 ? (
                    <div
                        onClick={() => {
                            setOpen(false)
                            setRevisionOverviewOpen(true)
                        }}
                        className="flex items-center justify-between px-6 py-3 transition-colors duration-100 ease-in border-t border-gray-300 cursor-pointer text-pzh-green hover:text-pzh-green-dark hover:bg-pzh-blue hover:bg-opacity-5">
                        <span className="underline">Vergelijk versies</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                ) : null}
            </div>
        </Modal>
    )
}

export default PopUpRevisionContainer
