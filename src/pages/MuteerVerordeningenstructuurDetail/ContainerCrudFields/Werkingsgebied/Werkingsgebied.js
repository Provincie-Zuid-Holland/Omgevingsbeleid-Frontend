import React from 'react'
import { toast } from 'react-toastify'
import { faSearch, faSpinner, faPlus } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from './../../../../API/axios'
import PopupContainer from './../../../../components/PopupContainer'

const Werkingsgebied = ({
    setWerkingsgebiedInParentState,
    werkingsgebiedInParentState,
}) => {
    const [popupOpen, setPopupOpen] = React.useState(false)

    const [werkingsgebied, setWerkingsgebied] = React.useState(null)
    const [
        werkingsgebiedTitelIsLoading,
        setWerkingsgebiedTitelIsLoading,
    ] = React.useState(true)

    // Function to GET the complete werkingsgebied object from the API
    // We need this in order to display the title
    React.useEffect(() => {
        console.log(werkingsgebiedInParentState)

        if (!werkingsgebiedInParentState) return
        console.log('werkingsgebiedInParentState')
        console.log(werkingsgebiedInParentState)
        if (
            werkingsgebiedInParentState &&
            werkingsgebiedInParentState === werkingsgebied
        )
            return

        setWerkingsgebiedTitelIsLoading(true)

        axios
            .get(`/werkingsgebieden/${werkingsgebiedInParentState}`)
            .then((res) => {
                setWerkingsgebied(res.data)
                setWerkingsgebiedTitelIsLoading(false)
            })
            .catch((err) => {
                toast('Er is iets misgegaan, probeer het later nog eens')
            })
    }, [werkingsgebiedInParentState])

    return (
        <React.Fragment>
            {werkingsgebiedInParentState ? (
                <div
                    className={`h-64 flex mt-2 justify-center items-center relative block cursor-pointer`}
                    onClick={() => setPopupOpen(true)}
                >
                    <div
                        className={`absolute top-0 left-0 z-10 w-full h-full border border-gray-100 rounded-md shadow`}
                    >
                        <div
                            style={{
                                backgroundImage:
                                    'url("' +
                                    `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${werkingsgebiedInParentState}')` +
                                    '")',
                            }}
                            className="block w-full h-full bg-center bg-cover rounded-md"
                        ></div>
                        <span class="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
                            {werkingsgebiedTitelIsLoading
                                ? 'Laden...'
                                : werkingsgebied.Werkingsgebied}
                        </span>
                    </div>
                    <span
                        className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 -mt-4`}
                    >
                        <FontAwesomeIcon
                            className="mr-2 rotate-icon"
                            icon={faSpinner}
                        />
                    </span>
                </div>
            ) : (
                <div
                    className="flex justify-center w-full px-4 py-2 mt-2 border-2 border-gray-400 border-dashed rounded-md cursor-pointer"
                    onClick={() => setPopupOpen(true)}
                >
                    <div>
                        <FontAwesomeIcon
                            className="mr-2 text-gray-400"
                            icon={faPlus}
                        />
                        <span className="py-4 pr-4 font-semibold text-gray-400">
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
        </React.Fragment>
    )
}

const WerkingsgebiedPopup = ({
    show,
    close,
    setWerkingsgebiedInParentState,
}) => {
    const [filterQuery, setFilterQuery] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(true)
    const [werkingsgebieden, setWerkingsgebieden] = React.useState(null)

    const getAndSetWerkingsgebieden = () => {
        axios
            .get(`/werkingsgebieden`)
            .then((res) => {
                setWerkingsgebieden(res.data)
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
                toast('Er is iets misgegaan, probeer het later nog eens')
            })
    }

    React.useEffect(() => {
        getAndSetWerkingsgebieden()
    }, [])

    const getImageUrl = ({ UUID }) => {
        return `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${UUID}')`
    }

    return (
        <PopupContainer show={show} close={close}>
            <div className="container flex items-center justify-center pb-8 mx-auto sm:px-6 lg:px-8">
                <div className="relative z-10 w-2/3 transition-all transform bg-white rounded-md rounded-lg shadow-xl screen-minus-nav">
                    <div className="h-full px-8 pt-8 pb-12 bg-white">
                        <h2 className="form-field-label">
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
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-600"
                                icon={faSearch}
                            />
                        </div>

                        <div className="flex grid flex-wrap h-screen grid-cols-2 gap-4 overflow-y-auto werkingsgebied-container">
                            {isLoading
                                ? null
                                : werkingsgebieden
                                      .filter((e) =>
                                          e.Werkingsgebied.toLowerCase().includes(
                                              filterQuery.toLowerCase()
                                          )
                                      )
                                      .map((gebied, index) => {
                                          const url = getImageUrl({
                                              UUID: gebied.UUID,
                                          })
                                          return (
                                              <div
                                                  className={`h-64 flex justify-center items-center relative block`}
                                                  onClick={() => {
                                                      setWerkingsgebiedInParentState(
                                                          gebied.UUID
                                                      )
                                                      close()
                                                  }}
                                              >
                                                  <div
                                                      className={`cursor-pointer absolute top-0 left-0 z-10 w-full h-full border border-gray-100 rounded-md shadow`}
                                                  >
                                                      <div
                                                          style={{
                                                              backgroundImage:
                                                                  'url("' +
                                                                  url +
                                                                  '")',
                                                          }}
                                                          className="block w-full h-full bg-center bg-cover rounded-md-t"
                                                      ></div>
                                                      <span class="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
                                                          {
                                                              gebied.Werkingsgebied
                                                          }
                                                      </span>
                                                  </div>
                                                  <span
                                                      className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 -mt-4 ${
                                                          index % 2 === 0
                                                              ? 'mr-4'
                                                              : 'ml-4'
                                                      }`}
                                                  >
                                                      <FontAwesomeIcon
                                                          className="mr-2 rotate-icon"
                                                          icon={faSpinner}
                                                      />
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
