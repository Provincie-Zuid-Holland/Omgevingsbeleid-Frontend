import React from "react"
import { useParams } from "react-router-dom"
import { faClock } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Transition } from "@headlessui/react"
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons"

import PopupRevisionOverview from "./../PopupRevisionOverview"

import useClickOutsideContainer from "./../../utils/useClickOutsideContainer"
import useCloseWithEscapeKey from "./../../utils/useCloseWithEscapeKey"

/**
 *
 * @param {object} props
 * @param {string} titleSingular - Type of object (e.g. Beleidskeuze)
 * @param {object} dataObject - Object we are viewing on the detail page
 * @param {array} revisionObjects - Revisions of the dataObject
 * @param {object} children - Children revision list item component(s)
 * @returns Component to toggle the revision popup and the
 */
const PopUpRevisionContainer = ({
    titleSingular,
    dataObject,
    revisionObjects,
    children,
}) => {
    const [open, setOpen] = React.useState(false)
    const [revisionOverviewOpen, setRevisionOverviewOpen] = React.useState(
        false
    )
    const amountOfRevisions = revisionObjects ? revisionObjects.length : 0

    const innerContainer = React.useRef(null)

    let { id } = useParams()

    React.useEffect(() => {
        setOpen(false)
    }, [id])

    useClickOutsideContainer(innerContainer, () => {
        setOpen(false)
    })

    useCloseWithEscapeKey(innerContainer, () => {
        setOpen(false)
    })

    const getAmountText = (amountOfRevisions) => {
        if (amountOfRevisions === 1) return "Geen revisies"
        return amountOfRevisions + " revisies"
    }

    return (
        <div className="relative inline-block" ref={innerContainer}>
            <div className="z-10 inline-block mr-3 text-sm text-gray-600">
                <span
                    onClick={() => {
                        if (amountOfRevisions > 1) {
                            setOpen(!open)
                        }
                    }}
                    className={`${
                        amountOfRevisions > 1 ? "cursor-pointer" : ""
                    } select-none`}
                >
                    <FontAwesomeIcon className="mr-2" icon={faClock} />
                    <span
                        className={
                            amountOfRevisions > 1 ? "hover:underline" : ""
                        }
                    >
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
 *
 * @param {object} props
 * @param {boolean} open - Indicating if the timeline popup is open
 * @param {object} revisionListItems - List item children components
 * @param {object} setOpen - Function to toggle the timeline popup
 * @param {object} setRevisionOverviewOpen - Function to toggle the revision overview popup
 * @param {object} titleSingular - Singular type title of the object we are viewing
 * @param {object} revisionObjects - Array of revisions
 * @returns Component that renders a toggleable popup with a timeline of revisions
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
        <Transition
            show={open}
            enter="transition ease-out duration-150 transform"
            enterFrom="-translate-y-1 scale-95"
            enterTo="translate-y-0 scale-100"
            leave="transition ease-in duration-100 transform"
            leaveFrom="translate-y-0 scale-100"
            leaveTo="-translate-y-1 scale-95"
        >
            <div className="absolute left-0 z-20 w-64 mt-3 -ml-24 text-gray-700 bg-white rounded main-tooltip-container">
                <div
                    className="relative h-full overflow-y-auto"
                    style={{ maxHeight: "50vh" }}
                >
                    <div className="absolute top-0 z-0 w-1 h-full ml-5 border-l border-gray-300" />
                    <ul className="pl-5">{revisionListItems}</ul>
                </div>

                {titleSingular === "Beleidskeuze" &&
                revisionObjects &&
                revisionObjects.length > 1 ? (
                    <div
                        onClick={() => {
                            setOpen(false)
                            setRevisionOverviewOpen(true)
                        }}
                        className="flex items-center justify-between px-5 py-3 transition-colors duration-100 ease-in border-t border-gray-300 cursor-pointer hover:bg-gray-100"
                    >
                        <span>Vergelijken</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                ) : null}
            </div>
        </Transition>
    )
}

export default PopUpRevisionContainer
