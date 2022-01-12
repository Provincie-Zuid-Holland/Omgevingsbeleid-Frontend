import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from './../../../API/axios'
import { API_ENDPOINT } from './../../../constants/beleidsmodules'
import handleError from './../../../utils/handleError'

const PopUpDetailDropdown = ({
    slug,
    dataObject,
    setDataObject,
    openState,
    toggleDropdown,
    toggleStatusPopup,
    toggleModulesPopup,
    raadpleegLink,
    titleSingular,
    dimensionHistory,
    setDimensionHistory,
}) => {
    const innerContainer = useRef(null)

    const handleClick = useCallback(
        e => {
            if (
                !innerContainer.current.contains(e.target) &&
                openState === true
            ) {
                toggleDropdown()
            }
        },
        [openState, toggleDropdown]
    )

    useEffect(() => {
        document.addEventListener('mousedown', handleClick, false)

        return () =>
            document.removeEventListener('mousedown', handleClick, false)
    }, [handleClick])

    const removeFromModules = async () => {
        const confirm = window.confirm(
            `Weet je zeker dat je '${dataObject.Titel}' wil verwijderen uit de module?`
        )
        if (!confirm) return

        const allBeleidsmodules = await axios
            .get(`/${API_ENDPOINT}`)
            .then(res => res.data)
            .catch(err => {
                console.error(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                return null
            })

        if (!allBeleidsmodules) return

        const connectionProperty =
            titleSingular === 'Maatregel' ? 'Maatregelen' : 'Beleidskeuzes'

        const modulesWithExistingConnection = allBeleidsmodules.filter(
            module =>
                module[connectionProperty].filter(
                    connection => connection.Object.ID === dataObject.ID
                ).length > 0
        )

        const generatePatchObject = module => ({
            [connectionProperty]: module[connectionProperty]
                // Filter out the object we want to remove
                .filter(connection => connection.Object.ID !== dataObject.ID)
                // Replace the .Object for a .UUID property for the API
                .map(connection => ({
                    Koppeling_Omschrijving: connection.Koppeling_Omschrijving,
                    UUID: connection.Object.UUID,
                })),
        })

        Promise.all(
            modulesWithExistingConnection.map(module =>
                axios
                    .patch(
                        `/${API_ENDPOINT}/${module.ID}`,
                        generatePatchObject(module)
                    )
                    .then(res => res.data)
            )
        )
            .then(res => {
                res.forEach(response => {
                    dataObject.Ref_Beleidsmodules =
                        dataObject.Ref_Beleidsmodules.filter(
                            module => response.ID !== module.ID
                        )
                })

                if (setDataObject) {
                    setDataObject({ ...dataObject })
                }

                const indexOfDataObject = dimensionHistory.findIndex(
                    e => e.UUID === dataObject.UUID
                )
                dimensionHistory[indexOfDataObject] = dataObject
                setDimensionHistory(dimensionHistory)

                toast(`${titleSingular} verwijderd uit module`)
            })
            .catch(err => handleError(err))
    }

    return (
        <div
            className="absolute top-0 right-0 z-10 w-48 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
            ref={innerContainer}>
            <div className="relative h-full">
                <ul className="text-sm text-gray-800">
                    {dataObject.Status !== 'Vigerend' &&
                    dataObject.Status !== 'Gepubliceerd' ? (
                        <li
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                                toggleDropdown()
                                toggleStatusPopup()
                            }}>
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
                                dataObject.Status !== 'Vigerend' &&
                                dataObject.Status !== 'Gepubliceerd'
                                    ? 'border-t'
                                    : ''
                            }`}>
                            Raadpleegomgeving
                        </a>
                    </li>

                    <li
                        className="px-4 py-2 text-sm border-t border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                            toggleDropdown()
                            if (dataObject?.Ref_Beleidsmodules?.length === 0) {
                                toggleModulesPopup()
                            } else {
                                removeFromModules()
                            }
                        }}>
                        {dataObject?.Ref_Beleidsmodules?.length === 0
                            ? 'Toevoegen aan module'
                            : 'Verwijderen uit module'}
                    </li>

                    {(titleSingular === 'Beleidskeuze' &&
                        dataObject.Status === 'Vigerend') ||
                    (titleSingular === 'Maatregel' &&
                        dataObject.Status === 'Vigerend') ? (
                        <li>
                            <Link
                                to={`/muteer/${slug}/edit/${dataObject.ID}?modus=wijzig_vigerend`}
                                id="navbar-popup-wijzig-vigerend"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300 hover:bg-gray-100">
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
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300 hover:bg-gray-100">
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
