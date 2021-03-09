import React, { Component } from 'react'
import { useParams } from 'react-router-dom'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'

import PopupRevisieoverzicht from './../PopupRevisieoverzicht'

import useClickOutsideContainer from './../../utils/useClickOutsideContainer'
import useCloseWithEscapeKey from './../../utils/useCloseWithEscapeKey'

const PopUpRevisieContainer = ({
    amountOfRevisions,
    type,
    dataObject,
    revisieObjecten,
    children,
}) => {
    const [open, setOpen] = React.useState(false)
    const [revisieoverzichtOpen, setRevisieoverzichtOpen] = React.useState(
        false
    )

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
        const singleOrPlural = amountOfRevisions === 1 ? 'revisie' : 'revisies'
        const text = amountOfRevisions + ' ' + singleOrPlural
        return text
    }

    return (
        <div
            className="relative z-50 inline-block mr-3 text-sm text-gray-600"
            ref={innerContainer}
        >
            <span
                onClick={() => setOpen(!open)}
                className="cursor-pointer select-none"
            >
                <FontAwesomeIcon className="mr-2" icon={faClock} />
                <span className="hover:underline">
                    {getAmountText(amountOfRevisions)}
                </span>
            </span>
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
                        style={{ maxHeight: '50vh' }}
                    >
                        <div className="absolute top-0 z-0 w-1 h-full ml-5 border-l border-gray-300" />
                        <ul className="pl-5">{children}</ul>
                    </div>
                    {type === 'Beleidskeuze' ? (
                        <div
                            onClick={() => {
                                setOpen(false)
                                setRevisieoverzichtOpen(true)
                            }}
                            className="flex items-center justify-between px-5 py-3 transition-colors duration-100 ease-in border-t border-gray-300 cursor-pointer hover:bg-gray-100"
                        >
                            <span>Vergelijken</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    ) : null}
                </div>
            </Transition>
            <PopupRevisieoverzicht
                dataObject={dataObject}
                revisieObjecten={revisieObjecten}
                revisieoverzichtOpen={revisieoverzichtOpen}
                setRevisieoverzichtOpen={setRevisieoverzichtOpen}
            />
        </div>
    )
}

export default PopUpRevisieContainer
