import React from 'react'

import Transition from '../../../components/Transition'
import FixedSidebarContainer from '../FixedSidebarContainer'

const EditOrderSidebar = ({
    isActiveChapter,
    userIsEditingOrder,
    setEditOrderMode,
    saveNewLineageStructure,
    cancelReorder,
}) => {
    const userIsEditingOrderOfHoofdstukken =
        !isActiveChapter && userIsEditingOrder

    const EditOrderComponent = () => (
        <div>
            <span className="mb-2 font-semibold text-gray-900">
                Volgorde wijzigen
            </span>
            <p className="text-gray-800">
                {userIsEditingOrderOfHoofdstukken
                    ? 'Je bent op dit moment de volgorde van de hoofdstukken aan het wijzigen'
                    : 'Je bent op dit moment de volgorde binnen dit hoofdstuk aan het wijzigen'}
            </p>
            <div className="flex items-center mt-5">
                <button
                    className="flex items-center justify-center inline-block px-4 py-2 mr-4 font-semibold text-white bg-green-600 border border-green-600 rounded cursor-pointer hover:text-white"
                    onClick={() => {
                        saveNewLineageStructure()
                        setEditOrderMode(false)
                    }}
                >
                    Opslaan
                </button>
                <button
                    className="text-sm text-gray-800 underline"
                    onClick={() => {
                        setEditOrderMode(false)
                        cancelReorder()
                    }}
                >
                    Annuleren
                </button>
            </div>
        </div>
    )

    return (
        <FixedSidebarContainer
            alignWithContainer={true}
            show={userIsEditingOrder}
        >
            <div>
                <Transition
                    show={userIsEditingOrder}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 transform translate-x-2"
                    enterTo="opacity-100 transform translate-x-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 transform translate-x-0"
                    leaveTo="opacity-0 transform translate-x-2"
                >
                    <EditOrderComponent />
                </Transition>
            </div>
        </FixedSidebarContainer>
    )
}

export default EditOrderSidebar
