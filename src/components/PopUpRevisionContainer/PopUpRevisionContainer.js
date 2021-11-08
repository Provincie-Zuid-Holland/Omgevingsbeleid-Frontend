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
