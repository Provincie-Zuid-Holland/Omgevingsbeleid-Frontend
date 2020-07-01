import React from 'react'

import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Transition from './../../../components/Transition'

import VerordeningContext from './../VerordeningContext'

// First properties are the AddSectionTypes. E.G. 'Paragraaf.
// When the user has 'Paragraaf' selected to add as a new section, we look at conditionals['Paragraaf] to see where we can place this object
// From here we can check if an item can be added parrallel, as a subitem or can be added from the top

const conditionals = {
    Afdeling: {
        parallel: ['Afdeling', 'Paragraaf'],
        subitems: [],
        addFromTop: ['childOfHoofdstuk'],
    },
    Paragraaf: {
        parallel: ['Paragraaf', 'Afdeling'],
        subitems: ['Afdeling'],
        addFromTop: ['childOfHoofdstuk'],
    },
    Artikel: {
        parallel: ['Artikel'],
        subitems: ['Paragraaf', 'Afdeling'],
        addFromTop: ['childOfHoofdstuk'],
    },
}

const AddObjectButton = ({ nestType, item, index }) => {
    const {
        addSection,
        addSectionType,
        hoofdstukIndex,
        userIsAddingSections,
    } = React.useContext(VerordeningContext)

    const [show, setShow] = React.useState(false)

    React.useLayoutEffect(() => {
        setShow(false)
        if (!addSectionType) {
            setShow(false)
        } else if (!item) {
            // AddObjectButton is above the DragAndDrop Component
            const placeableAtTopOfALevel = conditionals[addSectionType][
                'addFromTop'
            ].includes(nestType)
            if (placeableAtTopOfALevel) {
                setShow(true)
            }
        } else if (item) {
            // AddObjectButton is inside the DragAndDrop Component as 'parallel' or as 'subitems'
            const placeableParallelOrUnderItemType = conditionals[
                addSectionType
            ][nestType].includes(item.Type)

            if (placeableParallelOrUnderItemType) {
                setShow(true)
            }
        } else {
            setShow(false)
        }
    }, [addSectionType])

    const isHoofdstuk =
        nestType === 'Hoofdstuk' &&
        hoofdstukIndex === null &&
        userIsAddingSections

    // When the user is adding chapters (hoofdstukken) we always show the addObjectButton
    if (!show && !isHoofdstuk) return null

    return (
        <Transition
            show={show || isHoofdstuk}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 transform scale-50"
            enterTo="opacity-100 transform scale-100"
            leave="transition ease-out duration-0"
            leaveFrom="opacity-100 transform scale-100"
            leaveTo="opacity-0 transform scale-0"
        >
            <div
                className={nestType === 'subitems' ? 'pl-5' : ''}
                onClick={() => {
                    addSection({ index: index })
                }}
            >
                <div className="flex items-center justify-center w-full px-5 py-2 my-4 bg-green-100 border border-green-500 border-dashed cursor-pointer hover:bg-green-200">
                    <FontAwesomeIcon
                        className="text-sm text-green-500"
                        icon={faPlus}
                    />
                    {item ? item.Type + item.Titel : ''} - {nestType}
                </div>
            </div>
        </Transition>
    )
}

export default AddObjectButton
