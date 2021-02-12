import React from 'react'
import { toast } from 'react-toastify'
import format from 'date-fns/format'
import nlLocale from 'date-fns/locale/nl'
import { Transition } from '@headlessui/react'
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

const FormFieldWerkingsgebiedKoppeling = ({
    setWerkingsgebiedInParentState,
    werkingsgebiedInParentState,
    dataObjectProperty,
    titleSingular,
    fieldLabel,
    pValue,
    disabled,
    crudObject,
}) => {
    const [popupOpen, setPopupOpen] = React.useState(false)

    // werkingsgebiedInParentState only contains the UUID
    // 'werkingsgebied' Contains the whole object that we get from the API
    // We need this in order to dislay information of the object
    const [werkingsgebied, setWerkingsgebied] = React.useState(null)

    // On every change in the werkingsgebiedInParentState we GET the 'werkingsgebied' data from the API
    React.useEffect(() => {
        if (dataObjectProperty === 'Gebied') {
            // If there is no werkingsgebied prop
            if (
                !werkingsgebiedInParentState ||
                (werkingsgebied &&
                    werkingsgebiedInParentState === werkingsgebied.UUID)
            )
                return

            setWerkingsgebied(null)

            axios
                .get(`/version/werkingsgebieden/${werkingsgebiedInParentState}`)
                .then((res) => {
                    setWerkingsgebied(res.data)
                })
                .catch((err) => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        } else if (dataObjectProperty === 'Werkingsgebieden') {
            // If there is no werkingsgebied prop
            if (!werkingsgebiedInParentState) return

            // If the UUID the user selected is the same as the current one we have in state we return
            const userSelectedTheSameUUID =
                werkingsgebied &&
                werkingsgebiedInParentState[0].UUID === werkingsgebied.UUID

            if (
                !Array.isArray(werkingsgebiedInParentState) ||
                werkingsgebiedInParentState.length === 0 ||
                userSelectedTheSameUUID
            ) {
                return
            }

            setWerkingsgebied(null)
            axios
                .get(
                    `/version/werkingsgebieden/${werkingsgebiedInParentState[0].UUID}`
                )
                .then((res) => {
                    setWerkingsgebied(res.data)
                })
                .catch((err) => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        }
    }, [werkingsgebiedInParentState, werkingsgebied, dataObjectProperty])

    return (
        <React.Fragment>
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={titleSingular}
                disabled={disabled}
            />
            <div
                className={`flex flex-wrap mb-6 -mx-3 ${
                    disabled
                        ? 'opacity-75 pointer-events-none cursor-not-allowed'
                        : ''
                }`}
            >
                <div
                    className="w-full px-3"
                    id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                >
                    <CardSelectedWerkingsgebied
                        show={!!werkingsgebied}
                        setPopupOpen={setPopupOpen}
                        dataObjectProperty={dataObjectProperty}
                        setWerkingsgebiedInParentState={
                            setWerkingsgebiedInParentState
                        }
                        setWerkingsgebied={setWerkingsgebied}
                        werkingsgebied={werkingsgebied}
                    />
                    <Transition
                        show={!werkingsgebied}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
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
                    </Transition>
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

const CardSelectedWerkingsgebied = ({
    setPopupOpen,
    setWerkingsgebiedInParentState,
    setWerkingsgebied,
    dataObjectProperty,
    werkingsgebied,
    show,
}) => {
    return (
        <Transition
            show={show}
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-0 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div className="flex rounded shadow">
                <div
                    className="relative w-1/2 p-5 bg-white"
                    id="selected-werkingsgebied"
                >
                    <h3 className="pb-1 text-sm font-bold text-gray-700">
                        {werkingsgebied ? werkingsgebied.Werkingsgebied : null}
                    </h3>
                    <span className="text-xs text-gray-600">
                        Laatst gewijzigd op{' '}
                        {werkingsgebied
                            ? format(
                                  new Date(werkingsgebied.Modified_Date),
                                  'dd	MMMM yyyy',
                                  {
                                      locale: nlLocale,
                                  }
                              )
                            : null}
                    </span>
                    <span
                        className="absolute bottom-0 left-0 px-5 py-5 text-sm text-red-600 underline transition-colors ease-in cursor-pointer duration-50 hover:text-red-800"
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
                        className={`flex justify-center items-center relative cursor-pointer w-full h-full`}
                        onClick={() => setPopupOpen(true)}
                    >
                        <div
                            className={`cursor-pointer absolute top-0 left-0 w-full h-full border border-gray-100`}
                        >
                            <div
                                style={{
                                    backgroundImage:
                                        'url("' +
                                        `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${
                                            werkingsgebied
                                                ? werkingsgebied.UUID
                                                : ''
                                        }')` +
                                        '")',
                                }}
                                className="block w-full h-full bg-center bg-cover"
                            ></div>
                        </div>
                        <span
                            style={{ zIndex: '-1' }}
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
        </Transition>
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
    const [werkingsgebieden, setWerkingsgebieden] = React.useState(null)

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
                setIsLoading(false)
            })
    }

    React.useEffect(() => {
        getAndSetWerkingsgebieden()
    }, [])

    const getImageUrl = (UUID) => {
        return `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${UUID}')`
    }

    const setInParent = (uuid) => {
        if (dataObjectProperty === 'Gebied') {
            // Array containing the UUID's
            setWerkingsgebiedInParentState({
                target: {
                    name: dataObjectProperty,
                    value: uuid,
                },
            })
        } else if (dataObjectProperty === 'Werkingsgebieden') {
            // Single string of UUID
            setWerkingsgebiedInParentState({
                target: {
                    name: dataObjectProperty,
                    value: [
                        {
                            UUID: uuid,
                        },
                    ],
                },
            })
        }
    }

    return (
        <PopupContainer show={show} close={close}>
            <div className="container flex items-center justify-center pb-8 mx-auto sm:px-6 lg:px-8">
                <div className="relative z-10 w-2/3 transition-all transform bg-white rounded-md shadow-xl screen-minus-nav">
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
                            {isLoading
                                ? null
                                : werkingsgebieden
                                      .filter((e) =>
                                          e.Werkingsgebied.toLowerCase().includes(
                                              filterQuery.toLowerCase()
                                          )
                                      )
                                      .map((gebied, index) => {
                                          const url = getImageUrl(gebied.UUID)
                                          return (
                                              <div
                                                  key={gebied.UUID}
                                                  className={`h-64 flex justify-center items-center relative`}
                                                  onClick={() => {
                                                      setInParent(gebied.UUID)
                                                      close()
                                                  }}
                                              >
                                                  <div
                                                      className={`cursor-pointer z-0 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-md shadow`}
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
                                                      style={{ zIndex: '-1' }}
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

export default FormFieldWerkingsgebiedKoppeling
