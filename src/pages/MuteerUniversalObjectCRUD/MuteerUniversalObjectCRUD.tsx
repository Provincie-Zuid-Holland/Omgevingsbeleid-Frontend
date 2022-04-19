import * as axiosPackage from 'axios'
import cloneDeep from 'lodash.clonedeep'
import { KeyboardEvent, MouseEvent, useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet'
import {
    RouteComponentProps,
    useHistory,
    useLocation,
    useParams,
    withRouter,
} from 'react-router-dom'

import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import allDimensies from '@/constants/dimensies'
import checkContainsRequiredUnfilledField from '@/utils/checkContainsRequiredUnfilledField'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import formatGeldigheidDatesForAPI from '@/utils/formatGeldigheidDatesForAPI'
import formatGeldigheidDatesForUI from '@/utils/formatGeldigheidDatesForUI'
import handleError from '@/utils/handleError'
import { isDateInAValidRange } from '@/utils/isDateInAValidRange'
import isEndDateBeforeStartDate from '@/utils/isEndDateBeforeStartDate'
import makeCrudObject from '@/utils/makeCrudObject'
import makeCrudProperties from '@/utils/makeCrudProperties'
import { removeEmptyCRUDProperties } from '@/utils/removeEmptyCRUDProperties'
import scrollToElement from '@/utils/scrollToElement'
import { toastNotification } from '@/utils/toastNotification'

import ContainerCrudHeader from './ContainerCrudHeader'
import FormFieldContainerAmbities from './FormFieldContainers/FormFieldContainerAmbities'
import FormFieldContainerBelangen from './FormFieldContainers/FormFieldContainerBelangen'
import FormFieldContainerBeleidsdoelen from './FormFieldContainers/FormFieldContainerBeleidsdoelen'
import FormFieldContainerBeleidskeuzes from './FormFieldContainers/FormFieldContainerBeleidskeuzes'
import FormFieldContainerBeleidsmodules from './FormFieldContainers/FormFieldContainerBeleidsmodules'
import FormFieldContainerBeleidsprestaties from './FormFieldContainers/FormFieldContainerBeleidsprestaties'
import FormFieldContainerBeleidsregels from './FormFieldContainers/FormFieldContainerBeleidsregels'
import FormFieldContainerMaatregelen from './FormFieldContainers/FormFieldContainerMaatregelen'
import FormFieldContainerThemas from './FormFieldContainers/FormFieldContainerThemas'

/**
 * @returns a page where the user can create new or edit existing policy objects
 */

interface MuteerUniversalObjectCRUDProps extends RouteComponentProps {
    authUser?: GetTokeninfo200Identifier
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
}

const MuteerUniversalObjectCRUD = ({
    authUser,
    dimensieConstants,
}: MuteerUniversalObjectCRUDProps) => {
    const history = useHistory()
    const location = useLocation()
    const { single: objectID } = useParams<{ single: string }>()

    const [dataLoaded, setDataLoaded] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [crudObject, setCrudObject] = useState<any>({})

    const crudObjectRef = useRef<any>(crudObject)

    const [axiosCancelSource, setAxiosCancelSource] =
        useState<axiosPackage.CancelTokenSource>()

    const apiEndpoint = dimensieConstants.API_ENDPOINT
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW
    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titelMeervoud = dimensieConstants.TITLE_PLURAL

    useEffect(() => {
        crudObjectRef.current = crudObject
    }, [crudObject])

    /**
     *
     * @param {object} event - Contains the event object
     * @param {undefined|object} metaInfo - Optional parameter that contains an object with meta info about the executed action from a react-select <Select> element
     * @param {undefined|string} dataProp - Optional parameter containing a property name to reset the value of from a react-select <Select> element
     */
    const handleChange = (
        event: any,
        metaInfo?: { action: string },
        dataProp?: string
    ) => {
        let value: string | null
        let name: string

        if (metaInfo?.action === 'clear') {
            /** This is the case when the user clicks the 'x' icon in a react-select <Select> component */
            value = null
            name = dataProp || ''
        } else {
            value = event.target.value
            name = event.target.name

            const type = event.target.type
            if (type === 'date') {
                value = event.target.value
            }
        }

        const newCrudObject = cloneDeep(crudObjectRef.current)
        newCrudObject[name] = value
        setCrudObject(newCrudObject)
    }

    /**
     * Function to POST a policy object to the API
     * @param {object} crudObject - Contains the policy object with updated values
     */
    const postDimensieObject = (crudObject: any) => {
        axios
            .post(`${apiEndpoint}`, JSON.stringify(crudObject))
            .then(res => {
                history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}${
                        location.hash === '#mijn-beleid' ? '#mijn-beleid' : ''
                    }`
                )
                toastNotification({ type: 'saved' })
            })
            .catch(err => {
                handleError(err)
            })
    }

    /**
     * Function to PATCH a policy object to the API
     * @param {object} crudObject - Contains the policy object with updated values
     */
    const patchDimensieObject = (crudObject: any) => {
        axios
            .patch(`${apiEndpoint}/${objectID}`, JSON.stringify(crudObject), {
                cancelToken: axiosCancelSource?.token,
            })
            .then(() => {
                history.push(
                    `/muteer/${overzichtSlug}/${objectID}${
                        location.hash === '#mijn-beleid' ? '#mijn-beleid' : ''
                    }`
                )
                toastNotification({ type: 'saved' })
            })
            .catch(err => {
                // If error status is 400
                if (
                    err?.response?.status === 400 &&
                    err?.response?.data?.message ===
                        'Patching does not result in any changes.'
                ) {
                    history.push(
                        `/muteer/${overzichtSlug}/${objectID}${
                            location.hash === '#mijn-beleid'
                                ? '#mijn-beleid'
                                : ''
                        }`
                    )
                    toastNotification({ type: 'saved' })
                } else {
                    handleError(err)
                }
            })
    }

    /**
     * Submit handler
     * @param {object} event - Event object
     */
    const handleSubmit = (event: MouseEvent | KeyboardEvent) => {
        event.preventDefault()

        const params = new URL(document.location as any).searchParams
        const modus = params.get('modus')
        const isWijzigVigerend = modus === 'wijzig_vigerend'

        /** Check if all the required fields are filled in */
        if (
            checkContainsRequiredUnfilledField(
                crudObject,
                dimensieConstants,
                isWijzigVigerend
            )
        ) {
            return
        }

        /** Check if the ending validity date is before the starting validity date */
        if (isEndDateBeforeStartDate(crudObject)) {
            scrollToElement(
                `form-field-${titleSingular.toLowerCase()}-eind_geldigheid`
            )
            toastNotification({ type: 'end date before start date' })
            return
        }

        /** Check if the date properties are in a valid range */
        if (
            crudObject.hasOwnProperty('Begin_Geldigheid') &&
            crudObject.hasOwnProperty('Eind_Geldigheid')
        ) {
            const startDateIsInValidRange = isDateInAValidRange(
                new Date(crudObject.Begin_Geldigheid)
            )
            const endDateIsInValidRange = isDateInAValidRange(
                new Date(crudObject.Eind_Geldigheid)
            )

            const beginGeldigheidIsNotEmpty =
                crudObject.Begin_Geldigheid !== '1753-01-01' &&
                crudObject.Begin_Geldigheid !== null &&
                crudObject.Begin_Geldigheid !== ''

            const eindGeldigheidIsNotEmpty =
                crudObject.Eind_Geldigheid !== '10000-01-01' &&
                crudObject.Eind_Geldigheid !== null &&
                crudObject.Eind_Geldigheid !== ''

            if (!startDateIsInValidRange && beginGeldigheidIsNotEmpty) {
                scrollToElement(
                    `form-field-${titleSingular.toLowerCase()}-begin_geldigheid`
                )
                toastNotification({ type: 'start date valid range' })

                return
            } else if (!endDateIsInValidRange && eindGeldigheidIsNotEmpty) {
                scrollToElement(
                    `form-field-${titleSingular.toLowerCase()}-eind_geldigheid`
                )
                toastNotification({ type: 'end date valid range' })

                return
            }
        } else if (crudObject.hasOwnProperty('Besluit_Datum')) {
            const besluitDatumIsInValidRange = isDateInAValidRange(
                new Date(crudObject.Besluit_Datum)
            )

            const besluitDatumIsNotEmpty =
                crudObject.besluitDatumIsNotEmpty !== '1753-01-01' &&
                crudObject.besluitDatumIsNotEmpty !== null &&
                crudObject.besluitDatumIsNotEmpty !== ''

            if (!besluitDatumIsInValidRange && besluitDatumIsNotEmpty) {
                scrollToElement(
                    `form-field-${titleSingular.toLowerCase()}-begin_geldigheid`
                )
                toastNotification({ type: 'start date valid range' })

                return
            }
        }

        /** Prepare CRUD Object for the API */
        const newCrudObject = formatGeldigheidDatesForAPI(crudObject)
        setCrudObject(removeEmptyCRUDProperties(newCrudObject))

        /** If the user is editing an existing object we PATCH it, else we POST it to create a new object */
        const typeOfRequest = editStatus ? 'PATCH' : 'POST'

        if (typeOfRequest === 'PATCH') {
            setCrudObject(prepareForRequest(crudObject, 'patch'))
            patchDimensieObject(crudObject)
        } else if (typeOfRequest === 'POST') {
            setCrudObject(prepareForRequest(crudObject, 'post'))
            postDimensieObject(crudObject)
        }
    }

    /**
     * Function to prepare the crudObject for the API
     * @param {object} crudObject - Contains the policy object that holds the updated values
     * @param {string} type - String indicating if it is a 'post' or a 'patch' request
     * @returns {object} - Prepared object for the request
     */
    const prepareForRequest = (crudObject: any, type: string) => {
        // Get the connections
        const getConnectionProperties = () => {
            const crudProperties = dimensieConstants.CRUD_PROPERTIES
            const connectionKeys = Object.keys(crudProperties || {}).filter(
                key =>
                    crudProperties?.[key as keyof typeof crudProperties]
                        .type === 'connection'
            )
            return connectionKeys
        }

        const connectionProperties = getConnectionProperties()

        connectionProperties.forEach(key => {
            crudObject[key].forEach((connection: any, index: number) => {
                crudObject[key][index] = {
                    UUID: connection.Object.UUID,
                    Koppeling_Omschrijving: connection.Koppeling_Omschrijving,
                }
            })
        })

        crudObject?.Werkingsgebieden?.forEach((gebied: any, index: number) => {
            crudObject.Werkingsgebieden[index] = { UUID: gebied.Object.UUID }
        })

        if (crudObject.Gebied && crudObject.Gebied.UUID) {
            crudObject.Gebied = crudObject.Gebied.UUID
        }

        if (type === 'post') return crudObject

        // Continue prepping the object for a PATCH Request
        const eigenaren = [
            'Eigenaar_1',
            'Eigenaar_2',
            'Opdrachtgever',
            'Portefeuillehouder_1',
            'Portefeuillehouder_2',
        ]

        eigenaren.forEach(eigenaar => {
            if (!crudObject.hasOwnProperty(eigenaar)) return
            if (
                typeof crudObject[eigenaar] === 'object' &&
                crudObject[eigenaar] !== null
            ) {
                crudObject[eigenaar] = crudObject[eigenaar].UUID
            }
        })

        return crudObject
    }

    /**
     *
     * @param {string} propertyName - Property name of the connection
     * @param {object} object - Policy object for the connection
     * @param {string} omschrijving - Description of the connection
     * @param {function} callback - Callback that is passed the updated object
     */
    const voegKoppelingRelatieToe = (
        propertyName: string,
        object: any,
        omschrijving: string,
        callback: any
    ) => {
        const nieuwObject = {
            Koppeling_Omschrijving: omschrijving,
            Object: {
                UUID: object.UUID,
                Titel: object.Titel,
                Type: object.Type,
            },
        }

        const nieuwCrudObject = cloneDeep(crudObject)

        if (typeof nieuwCrudObject[propertyName] === 'string') {
            nieuwCrudObject[propertyName] = []
        }

        nieuwCrudObject[propertyName].push(nieuwObject)

        setCrudObject(nieuwCrudObject)
        toastNotification({ type: 'connection added' })
        callback(nieuwCrudObject)
    }

    /**
     * Function to update a connection
     * @param {object} koppelingObject - Connection object
     * @param {string} nieuweOmschrijving - New description of the connection
     * @param {function} callback - Callback that is passed the updated object
     */
    const wijzigKoppelingRelatie = (
        koppelingObject: any,
        nieuweOmschrijving: string,
        callback: any
    ) => {
        const newCrudObject = cloneDeep(crudObject)

        const index = newCrudObject[koppelingObject.propertyName].findIndex(
            (item: any) => item.Object.UUID === koppelingObject.item.Object.UUID
        )

        newCrudObject[koppelingObject.propertyName][
            index
        ].Koppeling_Omschrijving = nieuweOmschrijving

        setCrudObject(newCrudObject)
        toastNotification({ type: 'connection modified' })
        callback(newCrudObject)
    }

    /**
     * Function to remove a connection
     * @param {object} koppelingObject - Connection object
     */
    const verwijderKoppelingRelatie = (koppelingObject: any) => {
        const nieuwCrudObject = cloneDeep(crudObject)
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item: any) => item.Object.UUID === koppelingObject.item.Object.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        setCrudObject(nieuwCrudObject)
        toastNotification({ type: 'connection deleted' })
    }

    /**
     * Function to initialize an empty crudObject when the user is POST'ing a new policy object
     * @param {undefined|object} responseObjectFromAPI - Undefined when the user is creating a new policy object, an object when the user is editing an existing object
     */
    const createAndSetCrudObject = (responseObjectFromAPI?: any) => {
        const crudProperties = makeCrudProperties(dimensieConstants)

        const params = new URL(document.location as any).searchParams
        const modus = params.get('modus')

        const crudObject = makeCrudObject({
            crudProperties: crudProperties,
            dimensieConstants: dimensieConstants,
            existingObj: responseObjectFromAPI,
            modus: modus,
        })

        setCrudObject(crudObject)
        setDataLoaded(true)
    }

    /**
     * Gets the policy object from the API and set it in state as the crudObject
     */
    const getAndSetDimensieDataFromApi = () => {
        const params = new URL(document.location as any).searchParams

        const isMaatregelOrBeleidskeuze =
            titleSingular === 'Maatregel' || titleSingular === 'Beleidskeuze'

        /** If modus equals 'wijzig_vigerend', the user is editing a policy object that has a status of 'vigerend' */
        const modus = params.get('modus')
        const isWijzigVigerendOrOntwerpMaken =
            (modus && modus === 'wijzig_vigerend') ||
            (modus && modus === 'ontwerp_maken')

        axios
            .get(`${apiEndpoint}/${objectID}`, {
                cancelToken: axiosCancelSource?.token,
            })
            .then(res => {
                const responseObject = res.data
                let crudObject = null

                /** Check if user is allowed */
                const isUserAllowed = checkIfUserIsAllowedOnPage({
                    object: responseObject[0],
                    authUser,
                })
                if (!isUserAllowed) {
                    toastNotification({
                        type: 'user is not authenticated for this page',
                    })
                    history.push('/muteer/dashboard')
                }

                if (
                    isMaatregelOrBeleidskeuze &&
                    isWijzigVigerendOrOntwerpMaken
                ) {
                    // Get the first object with a status of 'Vigerend'
                    crudObject = responseObject.find(
                        (e: any) => e.Status === 'Vigerend'
                    )
                } else if (
                    titleSingular === 'Beleidskeuze' ||
                    titleSingular === 'Maatregel'
                ) {
                    crudObject = responseObject.find(
                        (e: any) => e.Aanpassing_Op === null
                    )
                } else {
                    crudObject = responseObject[0]
                }

                crudObject = formatGeldigheidDatesForUI(crudObject)
                createAndSetCrudObject(crudObject)
            })
            .catch(err => {
                console.warn(err)
                toastNotification({ type: 'standard error' })
            })
    }

    useEffect(() => {
        setAxiosCancelSource(axiosPackage.default.CancelToken.source())

        if (objectID) {
            /** URL Contains a single parameter, indicating that the user is editing an existing policy object */
            setEditStatus(true)
            getAndSetDimensieDataFromApi()
        } else {
            /** User is creating a new object */
            createAndSetCrudObject()
        }

        return () => {
            axiosCancelSource?.cancel('Axios request canceled.')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div aria-live="polite" aria-busy={!dataLoaded}>
            <Helmet>
                <title>
                    {editStatus
                        ? `Omgevingsbeleid - ${crudObject?.Titel || ''}`
                        : `Omgevingsbeleid - Voeg een nieuwe ${titleSingular} toe`}
                </title>
            </Helmet>

            <ContainerCrudHeader
                dataLoaded={dataLoaded}
                objectTitle={crudObject?.Titel}
                editStatus={editStatus}
                titelMeervoud={titelMeervoud}
                overzichtSlug={overzichtSlug || ''}
                titleSingular={titleSingular}
                objectID={objectID}
            />

            {dataLoaded ? (
                <ContainerMain>
                    <div className="flex-grow inline-block w-full">
                        <div>
                            <form className="mt-12">
                                {titleSingular === 'Ambitie' ? (
                                    <FormFieldContainerAmbities
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Beleidsmodule' ? (
                                    <FormFieldContainerBeleidsmodules
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Belang' ? (
                                    <FormFieldContainerBelangen
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Beleidsregel' ? (
                                    <FormFieldContainerBeleidsregels
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Beleidskeuze' ? (
                                    <FormFieldContainerBeleidskeuzes
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                        editStatus={editStatus}
                                        voegKoppelingRelatieToe={
                                            voegKoppelingRelatieToe
                                        }
                                        wijzigKoppelingRelatie={
                                            wijzigKoppelingRelatie
                                        }
                                        verwijderKoppelingRelatie={
                                            verwijderKoppelingRelatie
                                        }
                                    />
                                ) : null}

                                {titleSingular === 'Maatregel' ? (
                                    <FormFieldContainerMaatregelen
                                        editStatus={editStatus}
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Beleidsdoel' ? (
                                    <FormFieldContainerBeleidsdoelen
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Beleidsprestatie' ? (
                                    <FormFieldContainerBeleidsprestaties
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Thema' ? (
                                    <FormFieldContainerThemas
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                {titleSingular === 'Verordening' ? (
                                    <FormFieldContainerThemas
                                        titleSingular={titleSingular}
                                        crudObject={crudObject}
                                        handleChange={handleChange}
                                    />
                                ) : null}

                                <ButtonSubmitFixed submit={handleSubmit} />
                            </form>
                        </div>
                    </div>
                </ContainerMain>
            ) : (
                <LoaderContent />
            )}
        </div>
    )
}

export default withRouter(MuteerUniversalObjectCRUD)
