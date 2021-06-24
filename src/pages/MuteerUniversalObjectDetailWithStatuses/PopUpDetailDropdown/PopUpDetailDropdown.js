import React from 'react'
import { Link } from 'react-router-dom'

const PopUpDetailDropdown = ({
    slug,
    dataObject,
    openState,
    toggleDropdown,
    toggleStatusPopup,
    toggleModulesPopup,
    raadpleegLink,
    titleSingular,
}) => {
    const innerContainer = React.useRef(null)

    const handleClick = React.useCallback(
        (e) => {
            if (
                !innerContainer.current.contains(e.target) &&
                openState === true
            ) {
                toggleDropdown()
            }
        },
        [openState, toggleDropdown]
    )

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClick, false)

        return () =>
            document.removeEventListener('mousedown', handleClick, false)
    }, [handleClick])

    const status = dataObject.Status

    return (
        <div
            className="absolute top-0 right-0 z-10 w-48 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
            ref={innerContainer}
        >
            <div className="relative h-full">
                <ul className="text-sm text-gray-800">
                    {status !== 'Vigerend' && status !== 'Gepubliceerd' ? (
                        <li
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
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
                            className={`inline-block w-full px-4 py-2 text-sm hover:bg-gray-100 border-gray-300 ${
                                status !== 'Vigerend' &&
                                status !== 'Gepubliceerd'
                                    ? 'border-t'
                                    : ''
                            }`}
                        >
                            Raadpleegomgeving
                        </a>
                    </li>

                    <li
                        className="px-4 py-2 text-sm border-t border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                            toggleDropdown()
                            toggleModulesPopup()
                        }}
                    >
                        Wijzig module
                    </li>

                    {(titleSingular === 'Beleidskeuze' &&
                        status === 'Vigerend') ||
                    (titleSingular === 'Maatregel' && status === 'Vigerend') ? (
                        <li>
                            <Link
                                to={`/muteer/${slug}/edit/${dataObject.ID}?modus=wijzig_vigerend`}
                                id="navbar-popup-wijzig-vigerend"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300 hover:bg-gray-100"
                            >
                                Wijzigen zonder besluitvormingsproces
                            </Link>
                        </li>
                    ) : null}

                    {titleSingular === 'Beleidskeuze' ? (
                        <li>
                            <a
                                href={`/muteer/beleidsrelaties/${dataObject.UUID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="navbar-popup-href-beleidsrelaties"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300 hover:bg-gray-100"
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
