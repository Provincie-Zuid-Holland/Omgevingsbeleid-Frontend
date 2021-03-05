import React from 'react'
import Transition from '../../../components/Transition'

import { faCircle } from '@fortawesome/pro-regular-svg-icons'
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import VerordeningContext from '../VerordeningContext'

const AddSectionsSidebar = ({ show }) => {
    const {
        setAddSectionMode,
        addSectionMode,
        addSectionType,
        setAddSectionType,
        hoofdstukIndex,
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

    const userIsAddingSectionsInHoofdstukken =
        hoofdstukIndex === null || hoofdstukIndex === undefined

    return (
        <Transition
            show={show}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 transform translate-x-2"
            enterTo="opacity-100 transform translate-x-0"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 transform translate-x-0"
            leaveTo="opacity-0 transform translate-x-2"
        >
            <div
                className="fixed inline-block pl-10"
                style={{
                    width: styles.width + 'px',
                    top: styles.yPosition + 'px',
                    left: styles.xPosition + 'px',
                }}
            >
                <Transition
                    show={addSectionMode}
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
                            Je kunt op dit moment onderdelen toevoegen.
                            {userIsAddingSectionsInHoofdstukken
                                ? ''
                                : 'Selecteer het onderdeel dat je wil toevoegen.'}
                        </p>

                        {userIsAddingSectionsInHoofdstukken ? null : (
                            <div className="mt-5">
                                <div
                                    className="block py-3 pl-5 mb-2 font-semibold text-gray-900 cursor-pointer bg-primary-super-light"
                                    onClick={() => {
                                        if (addSectionType !== 'Afdeling') {
                                            setAddSectionType('Afdeling')
                                        } else {
                                            setAddSectionType(null)
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon
                                        className="mr-5 text-gray-700"
                                        icon={
                                            addSectionType === 'Afdeling'
                                                ? faCheckCircle
                                                : faCircle
                                        }
                                    />
                                    Afdeling
                                </div>
                                <div
                                    className="block py-3 pl-5 mb-2 font-semibold text-gray-900 cursor-pointer bg-primary-super-light"
                                    onClick={() => {
                                        if (addSectionType !== 'Paragraaf') {
                                            setAddSectionType('Paragraaf')
                                        } else {
                                            setAddSectionType(null)
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon
                                        className="mr-5 text-gray-700"
                                        icon={
                                            addSectionType === 'Paragraaf'
                                                ? faCheckCircle
                                                : faCircle
                                        }
                                    />
                                    Paragraaf
                                </div>
                                <div
                                    className="block py-3 pl-5 mb-2 font-semibold text-gray-900 cursor-pointer bg-primary-super-light"
                                    onClick={() => {
                                        if (addSectionType !== 'Artikel') {
                                            setAddSectionType('Artikel')
                                        } else {
                                            setAddSectionType(null)
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon
                                        className="mr-5 text-gray-700"
                                        icon={
                                            addSectionType === 'Artikel'
                                                ? faCheckCircle
                                                : faCircle
                                        }
                                    />
                                    Artikel
                                </div>
                            </div>
                        )}
                        <div className="flex items-center mt-5">
                            <button
                                className="text-sm text-gray-800 underline"
                                onClick={() => {
                                    setAddSectionMode(false)
                                    setAddSectionType(null)
                                }}
                            >
                                Annuleren
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    )
}

export default AddSectionsSidebar
