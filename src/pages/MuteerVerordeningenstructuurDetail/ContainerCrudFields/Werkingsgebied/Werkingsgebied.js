/* istanbul ignore file */

import { MagnifyingGlass, Plus, Spinner, Xmark } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import axios from '../../../../api/instance'
import { PopupContainer } from './../../../../components/Popup'

const Werkingsgebied = ({
    setWerkingsgebiedInParentState,
    werkingsgebiedInParentState,
}) => {
    const [popupOpen, setPopupOpen] = useState(false)

    // werkingsgebiedInParentState only contains the UUID
    // Contains the whole object that we get from the API
    const [werkingsgebied, setWerkingsgebied] = useState(null)
    const [werkingsgebiedTitelIsLoading, setWerkingsgebiedTitelIsLoading] =
        useState(true)

    // Function to GET the complete werkingsgebied object from the API
    // We need this in order to display the title
    useEffect(() => {
        const isTheSame =
            werkingsgebiedInParentState &&
            werkingsgebiedInParentState === werkingsgebied

        if (!werkingsgebiedInParentState || isTheSame) return

        const checkIfObject = potentialObj => {
            if (
                (typeof potentialObj === 'object' ||
                    typeof potentialObj === 'function') &&
                potentialObj !== null
            ) {
                return true
            } else {
                return false
            }
        }

        /**
         * If the werkingsgebiedInParentState is an Object we can set it directly in state
         * This is because when we edit an existing object, it will come as a werkingsgebied object
         * If we add a new object it comes as a UUID string that we first need to GET from the API.
         */
        const parentIsObject = checkIfObject(werkingsgebiedInParentState)

        if (parentIsObject) {
            setWerkingsgebied(werkingsgebiedInParentState)
            setWerkingsgebiedTitelIsLoading(false)
        } else {
            setWerkingsgebiedTitelIsLoading(true)

            axios
                .get(`/version/werkingsgebieden/${werkingsgebiedInParentState}`)
                .then(res => {
                    setWerkingsgebied(res.data)
                    setWerkingsgebiedTitelIsLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        }

        // eslint-disable-next-line
    }, [werkingsgebiedInParentState])

    const getGeoImage = () => {
        if (!werkingsgebiedInParentState) return null
        if (typeof werkingsgebiedInParentState === 'string') {
            return (
                'url("' +
                `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${werkingsgebiedInParentState}')` +
                '")'
            )
        } else {
            return (
                'url("' +
                `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${werkingsgebiedInParentState.UUID}')` +
                '")'
            )
        }
    }

    return (
        <>
            {werkingsgebiedInParentState ? (
                <div>
                    <div
                        className={`h-64 flex mt-2 justify-center items-center relative cursor-pointer`}
                        onClick={() => setPopupOpen(true)}>
                        <div
                            className={`cursor-pointer z-10 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-md shadow`}>
                            <div
                                style={{
                                    backgroundImage: getGeoImage(),
                                }}
                                className="block w-full h-full bg-center bg-cover rounded-md"></div>
                            <span className="absolute bottom-0 block w-full p-4 text-sm text-gray-700 bg-white">
                                {werkingsgebiedTitelIsLoading || !werkingsgebied
                                    ? 'Laden...'
                                    : werkingsgebied.Werkingsgebied}
                            </span>
                        </div>
                        <span
                            className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 -mt-4`}>
                            <Spinner className="mr-2 animate-spin" />
                        </span>
                    </div>
                    <span
                        onClick={() => {
                            setWerkingsgebiedInParentState(null)
                            setWerkingsgebied(null)
                        }}
                        className="block mt-2 mb-4 text-xs text-red-700 underline cursor-pointer hover:text-red-800">
                        Dit werkingsgebied ontkoppelen
                    </span>
                </div>
            ) : (
                <div
                    className="flex justify-center w-full px-4 py-2 mt-2 border-2 border-gray-400 border-dashed rounded-md cursor-pointer"
                    onClick={() => setPopupOpen(true)}>
                    <div>
                        <Plus className="mr-2 -mt-0.5 inline-block text-gray-400" />
                        <span className="py-4 pr-4 font-bold text-gray-400">
                            Werkingsgebied koppelen
                        </span>
                    </div>
                </div>
            )}
            <WerkingsgebiedPopup
                setWerkingsgebiedInParentState={setWerkingsgebiedInParentState}
                show={popupOpen}
                close={() => setPopupOpen(false)}
            />
        </>
    )
}

const WerkingsgebiedPopup = ({
    show,
    close,
    setWerkingsgebiedInParentState,
}) => {
    const [filterQuery, setFilterQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [werkingsgebieden, setWerkingsgebieden] = useState(null)

    const getAndSetWerkingsgebieden = () => {
        axios
            .get(`/werkingsgebieden`)
            .then(res => {
                setWerkingsgebieden(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    useEffect(() => {
        getAndSetWerkingsgebieden()
    }, [])

    const getImageUrl = ({ UUID }) => {
        return `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${UUID}')`
    }

    useEffect(() => {
        const fixedContainerEl = document.getElementById(
            'fixed-container-edit-content-sidebar'
        )

        // Get original body overflow
        const originalStyle =
            window.getComputedStyle(fixedContainerEl).overflowY

        // Prevent scrolling on mount
        if (show) {
            fixedContainerEl.style.overflowY = 'hidden'
        }
        // Re-enable scrolling when component unmounts
        return () => {
            fixedContainerEl.style.overflowY = originalStyle
        }
    }, [show]) // Empty array ensures effect is only run on mount and unmount

    return (
        <PopupContainer show={show} close={close}>
            <div className="container flex items-center justify-center pb-8 mx-auto sm:px-6 lg:px-8">
                <div className="relative z-10 w-2/3 transition-all transform bg-white rounded-md rounded-lg shadow-xl screen-minus-nav">
                    <div
                        onClick={close}
                        className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                        id={`close-werkingsgebied-popup`}>
                        <Xmark />
                    </div>
                    <div className="h-full px-8 pt-8 pb-12">
                        <h2 className="font-bold form-field-label">
                            Werkingsgebied koppelen
                        </h2>
                        <span className="form-field-description">
                            Selecteer het werkingsgebied wat je wilt koppelen
                        </span>
                        <div className="relative block w-full mt-4 mb-6">
                            <input
                                className="block w-full py-3 pl-4 pr-12 text-sm leading-tight text-gray-700 border border-gray-400 rounded shadow appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                                id={`form-field-werkingsgebied-zoekbalk`}
                                type="text"
                                value={filterQuery}
                                onChange={e => setFilterQuery(e.target.value)}
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <MagnifyingGlass className="absolute top-0 right-0 mt-4 mr-4 text-gray-600" />
                        </div>

                        <div className="grid h-screen grid-cols-2 gap-4 pb-2 pr-2 overflow-x-hidden overflow-y-auto werkingsgebied-container">
                            {isLoading && !werkingsgebieden
                                ? null
                                : werkingsgebieden
                                      .filter(e =>
                                          e?.Werkingsgebied?.toLowerCase()?.includes(
                                              filterQuery.toLowerCase()
                                          )
                                      )
                                      .map((gebied, index) => {
                                          const url = getImageUrl({
                                              UUID: gebied.UUID,
                                          })
                                          return (
                                              <div
                                                  key={`werkingsgebied-${index}`}
                                                  className={`h-64 flex justify-center items-center relative block`}
                                                  onClick={() => {
                                                      setWerkingsgebiedInParentState(
                                                          gebied.UUID
                                                      )
                                                      close()
                                                  }}>
                                                  <div
                                                      className={`cursor-pointer z-10 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-md shadow`}>
                                                      <div
                                                          style={{
                                                              backgroundImage:
                                                                  'url("' +
                                                                  url +
                                                                  '")',
                                                          }}
                                                          className="block w-full h-full bg-center bg-cover rounded-md-t"></div>
                                                      <span className="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
                                                          {
                                                              gebied.Werkingsgebied
                                                          }
                                                      </span>
                                                  </div>
                                                  <span
                                                      style={{ zIndex: -1 }}
                                                      className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 -mt-4 ${
                                                          index % 2 === 0
                                                              ? 'mr-4'
                                                              : 'ml-4'
                                                      }`}>
                                                      <Spinner className="mr-2 animate-spin" />
                                                  </span>
                                              </div>
                                          )
                                      })}
                        </div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}

export default Werkingsgebied
