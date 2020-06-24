import React from 'react'
import Transition from '../../../components/Transition'

import VerordeningContext from '../VerordeningContext'

const AddSectionsSidebar = () => {
    const {
        setAddSectionMode,
        saveNewLineageStructure,
        userIsAddingSections,
    } = React.useContext(VerordeningContext)

    const [styles, setStyles] = React.useState(0)
    const [windowSize, setWindowSize] = React.useState(null)

    React.useLayoutEffect(() => {
        const initWidth = (val) => setStyles(val)
        const regulationContainer = document.getElementById(
            'regulation-container'
        )
        const containerWidth = regulationContainer.offsetWidth
        const oneThirdContainerWidth = containerWidth * 0.333

        const offsetTop = regulationContainer.offsetTop
        const offsetLeft =
            containerWidth * 0.666 + regulationContainer.offsetLeft

        initWidth({
            width: oneThirdContainerWidth,
            yPosition: offsetTop,
            xPosition: offsetLeft,
        })

        const handleResize = () => {
            setWindowSize(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowSize])

    return (
        <div
            className="fixed inline-block pt-3 pl-10"
            style={{
                width: styles.width + 'px',
                top: styles.yPosition + 'px',
                left: styles.xPosition + 'px',
            }}
        >
            <Transition
                show={userIsAddingSections}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 transform translate-x-2"
                enterTo="opacity-100 transform translate-x-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 transform translate-x-0"
                leaveTo="opacity-0 transform translate-x-2"
            >
                <div>
                    <span className="mb-2 font-semibold text-gray-900">
                        Onderdelen toevoegen
                    </span>
                    <p className="text-gray-800">
                        Je kunt op dit moment onderdelen toevoegen. Sleep een
                        onderdeel wat hieronder staat naar de plek waar je het
                        onderdeel wilt toevoegen.
                    </p>
                    <div>
                        {/* <Droppable droppableId={'type-artikel'}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className="mt-5 font-bold text-gray-900 bg-gray-50"
                                >
                                    <Draggable
                                        index={0}
                                        draggableId={'0000___addArtikel'}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                className="flex items-center block py-3 pl-5 font-semibold text-gray-900 bg-primary-super-light"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                Artikel!
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                </div>
                            )}
                        </Droppable>
                        <Droppable
                            droppableId={'add-section'}
                            meta="add-section"
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className="mt-5 font-bold text-gray-900 bg-gray-50"
                                >
                                    <Draggable index={1} draggableId={'102'}>
                                        {(provided, snapshot) => (
                                            <div
                                                className="flex items-center block py-3 pl-5 font-semibold text-gray-900 bg-primary-super-light"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                Groep!
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                </div>
                            )}
                        </Droppable> */}
                    </div>
                    <div className="flex items-center mt-5">
                        <button
                            className="flex items-center justify-center inline-block px-4 py-2 mr-4 font-semibold text-white bg-green-600 border border-green-600 rounded cursor-pointer hover:text-white"
                            onClick={() => {
                                saveNewLineageStructure()
                                setAddSectionMode(false)
                            }}
                        >
                            Opslaan
                        </button>
                        <button
                            className="text-sm text-gray-800 underline"
                            onClick={() => setAddSectionMode(false)}
                        >
                            Annuleren
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    )
}

export default AddSectionsSidebar
