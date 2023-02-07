import { Transition } from '@headlessui/react'
import { FieldLabel, Modal } from '@pzh-ui/components'
import { MagnifyingGlass, Plus, Spinner } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { readWerkingsgebied } from '@/api/fetchers'
import { Werkingsgebied } from '@/api/fetchers.schemas'
import formatDate from '@/utils/formatDate'

export interface FormikWerkingsgebiedProps {
    dataObjectProperty: 'Gebied_UUID' | 'Werkingsgebieden'
    titleSingular: string
    label: string
    description: string
    disabled?: boolean
    required?: boolean
}

type parentStateHandlerTypes = 'ADD_CONNECTION' | 'REMOVE_CONNECTION'

const FormikWerkingsgebied = ({
    dataObjectProperty,
    titleSingular,
    label,
    description,
    disabled,
    required,
}: FormikWerkingsgebiedProps) => {
    const { values, setFieldValue } = useFormikContext<any>()

    const werkingsgebiedInParentState = values[dataObjectProperty]

    const parentStateHandler = (
        type: parentStateHandlerTypes,
        newValue?: any
    ) => {
        switch (type) {
            case 'ADD_CONNECTION':
                setFieldValue(dataObjectProperty, newValue)
                break
            case 'REMOVE_CONNECTION':
                setFieldValue(
                    dataObjectProperty,
                    dataObjectProperty === 'Gebied_UUID' ? null : []
                )
                break
            default:
                break
        }
    }

    const [popupOpen, setPopupOpen] = useState(false)
    const [werkingsgebied, setWerkingsgebied] = useState<Werkingsgebied | null>(
        null
    )

    useEffect(() => {
        if (dataObjectProperty === 'Gebied_UUID') {
            setWerkingsgebied(werkingsgebiedInParentState)
        } else if (dataObjectProperty === 'Werkingsgebieden') {
            if (werkingsgebiedInParentState && werkingsgebiedInParentState[0]) {
                setWerkingsgebied(werkingsgebiedInParentState[0].Object)
            } else {
                setWerkingsgebied(null)
            }
        }
    }, [werkingsgebiedInParentState, dataObjectProperty])

    return (
        <>
            <FieldLabel
                required={required}
                label={label}
                description={description}
                name={dataObjectProperty}
            />
            <div
                className={`flex flex-wrap mb-6 -mx-3 ${
                    disabled
                        ? 'opacity-75 pointer-events-none cursor-not-allowed'
                        : ''
                }`}>
                <div
                    className="w-full px-3"
                    id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}>
                    <CardSelectedWerkingsgebied
                        show={!!werkingsgebied}
                        setPopupOpen={setPopupOpen}
                        parentStateHandler={parentStateHandler}
                        werkingsgebied={werkingsgebied}
                    />
                    <Transition
                        show={!werkingsgebied}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <div
                            className="flex justify-center w-full px-4 py-2 mt-2 border-2 border-gray-400 border-dashed rounded-md cursor-pointer"
                            onClick={() => setPopupOpen(true)}>
                            <div className="flex items-center">
                                <Plus className="mr-2 -mt-1 text-gray-400" />
                                <span className="py-4 pr-4 font-bold text-gray-400">
                                    Werkingsgebied koppelen
                                </span>
                            </div>
                        </div>
                    </Transition>
                    <WerkingsgebiedPopup
                        dataObjectProperty={dataObjectProperty}
                        parentStateHandler={parentStateHandler}
                        show={popupOpen}
                        close={() => setPopupOpen(false)}
                    />
                </div>
            </div>
        </>
    )
}

interface CardSelectedWerkingsgebiedProps {
    setPopupOpen: (state: boolean) => void
    parentStateHandler: (type: parentStateHandlerTypes, newValue?: any) => void
    werkingsgebied: Werkingsgebied | null
    show?: boolean
}

const CardSelectedWerkingsgebied = ({
    setPopupOpen,
    parentStateHandler,
    werkingsgebied,
    show,
}: CardSelectedWerkingsgebiedProps) => {
    return (
        <Transition
            show={show}
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-0 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="flex rounded shadow">
                <div
                    className="relative w-1/2 p-5 bg-white"
                    id="selected-werkingsgebied">
                    <h3 className="pb-1 text-sm font-bold text-gray-700">
                        {werkingsgebied ? werkingsgebied.Werkingsgebied : null}
                    </h3>
                    <span className="text-xs text-gray-600">
                        Laatst gewijzigd op{' '}
                        {werkingsgebied
                            ? formatDate(
                                  new Date(werkingsgebied.Modified_Date || ''),
                                  'dd	MMMM yyyy'
                              )
                            : null}
                    </span>
                    <span
                        className="absolute bottom-0 left-0 px-5 py-5 text-sm text-red-600 underline transition-colors duration-100 ease-in cursor-pointer hover:text-red-800"
                        onClick={() => {
                            parentStateHandler('REMOVE_CONNECTION')
                        }}
                        id={`form-field-werkingsgebied-ontkoppelen`}>
                        Dit werkingsgebied ontkoppelen
                    </span>
                </div>
                <div className="w-1/2 h-64">
                    <div
                        className={`flex justify-center items-center relative cursor-pointer w-full h-full`}
                        onClick={() => setPopupOpen(true)}>
                        <div
                            className={`cursor-pointer absolute top-0 left-0 w-full h-full border border-gray-100`}>
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
                                className="block w-full h-full bg-center bg-cover"></div>
                        </div>
                        <span
                            style={{ zIndex: -1 }}
                            className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 -mt-4`}>
                            <Spinner className="mr-2 animate-spin" />
                        </span>
                    </div>
                </div>
            </div>
        </Transition>
    )
}

interface WerkingsgebiedPopupProps {
    show?: boolean
    close: () => void
    parentStateHandler: (type: parentStateHandlerTypes, newValue?: any) => void
    dataObjectProperty: string
}

const WerkingsgebiedPopup = ({
    show,
    close,
    parentStateHandler,
    dataObjectProperty,
}: WerkingsgebiedPopupProps) => {
    const [filterQuery, setFilterQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [werkingsgebieden, setWerkingsgebieden] = useState<
        Werkingsgebied[] | null
    >(null)

    const getAndSetWerkingsgebieden = () => {
        readWerkingsgebied()
            .then(data => {
                setWerkingsgebieden(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getAndSetWerkingsgebieden()
    }, [])

    const getImageUrl = (UUID: string) => {
        return `https://geo-omgevingsbeleid-test.azurewebsites.net/wms/reflect?format=image/png&layers=OMGEVINGSBELEID:Werkingsgebieden_brt&srs=EPSG:28992&width=450&bbox=43662.62,406692,140586.08,483120&cql_filter=UUID IN ('${UUID}')`
    }

    const setInParent = (gebied: Werkingsgebied) => {
        if (dataObjectProperty === 'Gebied') {
            parentStateHandler('ADD_CONNECTION', gebied)
        } else if (dataObjectProperty === 'Werkingsgebieden') {
            parentStateHandler('ADD_CONNECTION', [
                {
                    Object: gebied,
                },
            ])
        }
    }

    return (
        <Modal
            open={show}
            onClose={close}
            ariaLabel="Werkingsgebied koppelen"
            closeButton
            maxWidth="max-w-2xl">
            <div>
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
                    <MagnifyingGlass className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-600" />
                </div>

                <div className="grid h-screen grid-cols-2 gap-4 pb-2 pr-2 overflow-x-hidden overflow-y-auto werkingsgebied-container">
                    {isLoading
                        ? null
                        : werkingsgebieden
                              ?.filter(e =>
                                  e.Werkingsgebied?.toLowerCase().includes(
                                      filterQuery?.toLowerCase()
                                  )
                              )
                              .map((gebied, index) => {
                                  const url = getImageUrl(gebied.UUID || '')
                                  return (
                                      <div
                                          key={gebied.UUID}
                                          className={`h-64 flex justify-center items-center relative`}
                                          onClick={() => {
                                              parentStateHandler(
                                                  'ADD_CONNECTION',
                                                  gebied
                                              )
                                              setInParent(gebied)
                                              close()
                                          }}>
                                          <div
                                              className={`cursor-pointer z-0 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-md shadow`}>
                                              <div
                                                  style={{
                                                      backgroundImage:
                                                          'url("' + url + '")',
                                                  }}
                                                  className="block w-full h-full bg-center bg-cover rounded-md-t"></div>
                                              <span className="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
                                                  {gebied.Werkingsgebied}
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
        </Modal>
    )
}

export default FormikWerkingsgebied
