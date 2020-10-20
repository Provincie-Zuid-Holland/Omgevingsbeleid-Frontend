import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const PopUpDetailDropdown = ({
    dataObject,
    openState,
    toggleDropdown,
    toggleStatusPopup,
    raadpleegLink,
    titelEnkelvoud,
}) => {
    const innerContainer = React.useRef(null)

    const handleClick = (e) => {
        if (!innerContainer.current.contains(e.target) && openState === true) {
            toggleDropdown()
        }
    }

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClick, false)

        return () =>
            document.removeEventListener('mousedown', handleClick, false)
    }, [])

    const status = dataObject.Status

    return (
        <div
            className="absolute top-0 right-0 z-10 w-48 mt-2 mt-12 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
            ref={innerContainer}
        >
            <div className="relative h-full">
                <ul className="text-sm text-gray-800">
                    {status !== 'Vigerend' && status !== 'Gepubliceerd' ? (
                        <li
                            className="px-4 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                toggleDropdown()
                                toggleStatusPopup()
                            }}
                        >
                            Status aanpassen
                        </li>
                    ) : null}

                    <li>
                        <a
                            href={raadpleegLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="navbar-popup-href-raadpleeg-omgeving"
                            className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                        >
                            Raadpleegomgeving
                        </a>
                    </li>
                    {titelEnkelvoud === 'Beleidskeuze' &&
                    status === 'Vigerend' ? (
                        <li>
                            <Link
                                to={`/muteer/beleidskeuzes/edit/${dataObject.ID}?modus=wijzig_vigerend`}
                                id="navbar-popup-wijzig-vigerend"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Wijzigen zonder besluitvormingsproces
                            </Link>
                        </li>
                    ) : null}

                    {titelEnkelvoud === 'Beleidskeuze' ? (
                        <li>
                            <a
                                href={`/muteer/beleidsrelaties/${dataObject.UUID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="navbar-popup-href-beleidsrelaties"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Bekijk beleidsrelaties
                            </a>
                        </li>
                    ) : null}
                </ul>
            </div>
        </div>
    )
}
export default PopUpDetailDropdown
