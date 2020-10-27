import React from 'react'
import { toast } from 'react-toastify'
import format from 'date-fns/format'
import nlLocale from 'date-fns/locale/nl'
import {
    faSearch,
    faSpinner,
    faTimes,
    faPlus,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from './../../API/axios'
import PopupContainer from './../PopupContainer'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

const FormFieldWerkingsgebiedKoppelingSingle = ({
    setWerkingsgebiedInParentState,
    werkingsgebiedInParentState,
    dataObjectProperty,
    titelEnkelvoud,
    fieldLabel,
    pValue,
}) => {
    const [popupOpen, setPopupOpen] = React.useState(false)

    // werkingsgebiedInParentState only contains the UUID
    // Contains the whole object that we get from the API
    const [werkingsgebied, setWerkingsgebied] = React.useState(null)

    // Function to GET the complete werkingsgebied object from the API
    // We need this in order to display the title
    React.useEffect(() => {
        // If there is no werkingsgebied prop
        if (
            !werkingsgebiedInParentState ||
            (werkingsgebied &&
                werkingsgebiedInParentState === werkingsgebied.UUID)
        )
            return

        setWerkingsgebied(null)

        axios
            .get(`/werkingsgebieden/${werkingsgebiedInParentState}`)
            .then((res) => {
                setWerkingsgebied(res.data)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [werkingsgebiedInParentState, werkingsgebied])

    return (
        <React.Fragment>
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titelEnkelvoud={titelEnkelvoud}
            />
            <div className="flex flex-wrap mb-6 -mx-3">
                <div
                    className="w-full px-3"
                    id={`form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                >
                    {werkingsgebiedInParentState ? (
                        <div>
                            <div className="flex rounded shadow">
                                <div className="relative w-1/2 p-5 bg-white">
                                    <h3 className="py-2 text-sm font-bold text-gray-700">
                                        {werkingsgebied
                                            ? werkingsgebied.Werkingsgebied
                                            : null}
                                    </h3>
                                    <span className="py-1 text-xs text-gray-600">
                                        Laatst gewijzigd op{' '}
                                        {werkingsgebied
                                            ? format(
                                                  new Date(
                                                      werkingsgebied.Modified_Date
                                                  ),
                                                  'dd	MMMM yyyy',
                                                  {
                                                      locale: nlLocale,
                                                  }
                                              )
                                            : null}
                                    </span>
                                    <span
                                        className="absolute bottom-0 left-0 mb-5 ml-5 text-sm text-red-600 underline cursor-pointer"
                                        onClick={() => {
                                            setWerkingsgebiedInParentState({
                                                target: {
                                                    name: dataObjectProperty,
                                                    value: null,
                                                },
                                            })
                                            setWerkingsgebied(null)
                                        }}
                                        id={`form-field-werkingsgebied-ontkoppelen`}
                                    >
                                        Dit werkingsgebied ontkoppelen
                                    </span>
                                </div>
                                <div className="w-1/2 h-64">
                                    <div
                                        className={`flex justify-center items-center relative block cursor-pointer w-full h-full`}
                                        onClick={() => setPopupOpen(true)}
                                    >
                                        <div
                                            className={`cursor-pointer z-10 absolute top-0 left-0 w-full h-full border border-gray-100`}
                                        >
                                            <div
                                                style={{
                                                    backgroundImage:
                                                        'url("' +
                                                        `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${werkingsgebiedInParentState}')` +
                                                        '")',
                                                }}
                                                className="block w-full h-full bg-center bg-cover"
                                            ></div>
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
                                </div>
                            </div>
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
                        dataObjectProperty={dataObjectProperty}
                        setWerkingsgebiedInParentState={
                            setWerkingsgebiedInParentState
                        }
                        show={popupOpen}
                        close={() => setPopupOpen(false)}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

const WerkingsgebiedPopup = ({
    show,
    close,
    setWerkingsgebiedInParentState,
    dataObjectProperty,
}) => {
    const [filterQuery, setFilterQuery] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(true)
    const [werkingsgebieden, setWerkingsgebieden] = React.useState([])

    const getAndSetWerkingsgebieden = () => {
        axios
            .get(`/werkingsgebieden`)
            .then((res) => {
                setWerkingsgebieden(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setWerkingsgebieden([])
                setIsLoading(false)
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
                    <div
                        onClick={close}
                        className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                        id={`close-werkingsgebied-popup`}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <div className="h-full px-8 pt-8 pb-12">
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

                        <div className="grid h-screen grid-cols-2 gap-4 pb-2 pr-2 overflow-x-hidden overflow-y-auto werkingsgebied-container">
                            {!isLoading && werkingsgebieden
                                ? werkingsgebieden
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
                                                          {
                                                              target: {
                                                                  name: dataObjectProperty,
                                                                  value:
                                                                      gebied.UUID,
                                                              },
                                                          }
                                                      )
                                                      close()
                                                  }}
                                              >
                                                  <div
                                                      className={`cursor-pointer z-10 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-md shadow`}
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
                                                      <span className="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
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
                                      })
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}

export default FormFieldWerkingsgebiedKoppelingSingle
