import React, { Component } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import LoaderContent from './../../components/LoaderContent'

// Import Components
import ButtonBackToPage from '../../components/ButtonBackToPage'
import EigenaarsDriehoek from '../../components/EigenaarsDriehoek'
import ContainerMain from '../../components/ContainerMain'
import ContainerDetail from './ContainerDetail'

import StatusHistorie from './StatusHistorie'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Utils
import deletePropertiesWithNullValue from '../../utils/deletePropertiesWithNullValue'
import deleteUnkownProperties from '../../utils/deleteUnkownProperties'
import cloneDeep from 'lodash.clonedeep'

// Generate Back Button for Detail or Version page
function GenerateBackToButton({ overzichtSlug, pageType, hash, dataObject }) {
    if (pageType === 'detail') {
        if (hash === '#mijn-beleid') {
            return (
                <ButtonBackToPage
                    terugNaar={` mijn beleid`}
                    url={`/muteer/mijn-beleid`}
                />
            )
        } else {
            return (
                <ButtonBackToPage
                    terugNaar={` overzicht`}
                    url={`/muteer/${overzichtSlug}`}
                />
            )
        }
    } else if (pageType === 'version') {
        const dataObjectID = dataObject.ID
        return (
            <ButtonBackToPage
                terugNaar={`huidige versie`}
                url={`/muteer/${overzichtSlug}/${dataObjectID}`}
            />
        )
    } else {
        return null
    }
}

const MuteerUniversalObjectDetailWithStatuses = ({ dimensieConstants }) => {
    const location = useLocation()
    const { single, version } = useParams()

    const [pageType, setPageType] = React.useState(
        version ? 'version' : 'detail'
    )
    const [dataObject, setDataObject] = React.useState(null)
    const [dataReceived, setDataReceived] = React.useState(false)
    const [dimensieHistorieSet, setDimensieHistorieSet] = React.useState(false)
    const [dimensieHistorie, setDimensieHistorie] = React.useState(null)

    // returned het api endpoint op basis van het pagina type
    const getApiEndpoint = () => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        if (pageType === 'detail') {
            return `${apiEndpoint}/${single}`
        } else if (pageType === 'version') {
            return `${apiEndpoint}/version/${version}`
        }
    }

    const generateDimensieHistorie = (dimensieHistorie) => {
        dimensieHistorie = dimensieHistorie.reverse()
        // Er kunnen meerdere vigerende objecten zijn in die dimensieHistorie
        // Om de oude in de filteredDimensieHistorie te stoppen moeten we weten op welke index het laatste vigerende object zit, zodat we de ge-archiveerde objecten in de filteredDimensieHistorie kunnen pushen.

        // De dimensies worden bevatten verschillende Status waarden. We willen elke voor elke status wijiziging de laatste versie met die status in een array pushen. Deze array wordt vervolgens gebruikt om de UI mee op te bouwen en het verloop van de wijzigingen binnen het dimensie object te tonen.
        let filteredDimensieHistorie = []

        // We pushen een dimensieObject naar de filteredDimensieHistorie door te mappen over de dimensieHistorie, waarbij we kijken of het volgende object in de dimensieHistorie een andere status heeft dan de huidige status. Indien dat zo is pushen we het object in de array.

        dimensieHistorie.forEach((dimensieObject, index) => {
            const isLastItem = index + 1 === dimensieHistorie.length
            // Als de status anders is dan het volgende object in de dimensieHistorie pushen we deze in de Array
            if (
                !isLastItem &&
                dimensieObject.Status !== dimensieHistorie[index + 1].Status
            ) {
                // Als het dimensieObject de Status waarde 'Vigerend' of 'Gepubliceerd heeft wijze we dit dimensieObject toe aan de variabele 'vigerendeDimensieObject'.
                filteredDimensieHistorie.push(dimensieObject)
            } else if (index === 0 && isLastItem) {
                // Als de dimensieHistorie een lengte heeft van 1
                filteredDimensieHistorie.push(dimensieObject)
            } else if (isLastItem) {
                // Als we het laatste onderdeel hebben in de dimensieHistorie wijzen we deze altijd aan, want dat is altijd het meest up-to-date object
                filteredDimensieHistorie.push(dimensieObject)
            }
        })

        setDimensieHistorie([...filteredDimensieHistorie])
        setDimensieHistorieSet(true)
    }

    const getAndSetDimensieDataFromApi = () => {
        const apiEndpoint = getApiEndpoint()
        // Connect With the API
        axios
            .get(apiEndpoint)
            .then((res) => {
                let dataObjectFromAPI = null
                if (pageType === 'detail') {
                    dataObjectFromAPI = res.data[0]
                } else if (pageType === 'version') {
                    dataObjectFromAPI = res.data
                }
                setDataObject(dataObjectFromAPI)
                setDataReceived(true)
                generateDimensieHistorie(res.data)
            })
            .catch((err) => {
                toast(process.env.REACT_APP_ERROR_MSG)
                console.log(err)
            })
    }

    const patchStatus = (crudObject, newStatus) => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const objectID = crudObject.ID
        let crudObjectToPatch = cloneDeep(crudObject)
        crudObjectToPatch.Status = newStatus
        crudObjectToPatch = deleteUnkownProperties(crudObjectToPatch)
        crudObjectToPatch = deletePropertiesWithNullValue(crudObjectToPatch)

        axios
            .patch(
                `${apiEndpoint}/${objectID}`,
                JSON.stringify(crudObjectToPatch)
            )
            .then((res) => {
                toast(
                    `Status succesvol gewijzigd naar ${crudObjectToPatch.Status}`
                )
                updateStateMetResponse(res.data)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const updateStateMetResponse = (responseObject) => {
        let dimensieHistorieCopy = dimensieHistorie
        dimensieHistorieCopy.push(responseObject)
        setDimensieHistorie([...dimensieHistorieCopy])
    }

    React.useEffect(() => {
        getAndSetDimensieDataFromApi()
    }, [])

    // Handle switch from to/from ID to/from UUID page
    React.useEffect(() => {
        setPageType(version ? 'version' : 'detail')
        setDataObject(null)
        setDataReceived(false)
        getAndSetDimensieDataFromApi()
    }, [version])

    // Variables to give as props
    const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
    const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

    // Het vigerendeDimensieObject is de variabele waarin we het object dat vigerend is, wat het laatste in de de dimensieHistorie zit in plaatsen.
    let vigerendeDimensieObject = null
    let vigerendeDimensieObjectIndex = null
    let isAConceptInProgress = false

    // forEach loop om te kijken of er een vigerend object is en zo ja, welke index deze heeft
    if (dimensieHistorieSet) {
        dimensieHistorie.forEach((dimensieObject, index) => {
            if (
                dimensieObject.Status === 'Vigerend' ||
                dimensieObject.Status === 'Gepubliceerd'
            ) {
                vigerendeDimensieObject = dimensieObject
                vigerendeDimensieObjectIndex = index
            }
        })
    }

    const isVigerendObject = vigerendeDimensieObjectIndex !== null

    const isConceptAfterVigerendObject =
        isVigerendObject &&
        vigerendeDimensieObjectIndex !== dimensieHistorie.length - 1

    const isVigerendObjectInLineageOfLengthOne =
        isVigerendObject &&
        vigerendeDimensieObjectIndex === dimensieHistorie.length - 1

    if (
        (isConceptAfterVigerendObject &&
            !isVigerendObjectInLineageOfLengthOne) ||
        !isVigerendObject
    ) {
        isAConceptInProgress = true
    }

    return (
        <ContainerMain>
            <Helmet>
                <title>
                    Omgevingsbeleid{' '}
                    {dataObject && dataObject.Titel
                        ? ' - ' + dataObject.Titel
                        : ''}
                </title>
            </Helmet>

            {/* Dimensie Container */}
            <div className="inline-block w-full">
                <GenerateBackToButton
                    hash={location.hash}
                    dataObject={dataObject}
                    overzichtSlug={overzichtSlug}
                    pageType={pageType}
                />

                {dataReceived && dimensieHistorieSet ? (
                    <div className="flex pb-24">
                        <div
                            className={`${
                                overzichtSlug !== 'beleidskeuzes' ||
                                overzichtSlug !== 'maatregelen'
                                    ? 'w-full'
                                    : 'w-9/12'
                            } pr-8`}
                        >
                            {pageType === 'detail' && !isAConceptInProgress ? (
                                <div className="h-10 mt-5 ">
                                    <Link
                                        className="flex items-center w-1/2 mt-5"
                                        to={`/muteer/${overzichtSlug}/edit/${single}?modus=ontwerp_maken${
                                            location.hash === '#mijn-beleid'
                                                ? '#mijn-beleid'
                                                : ''
                                        }`}
                                        id={`href-ontwerp-maken`}
                                    >
                                        <span className="relative flex items-center justify-end w-8 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                            <div className="absolute w-8 h-8 pt-1 text-center bg-gray-300 rounded-full -right-4">
                                                <FontAwesomeIcon
                                                    className="relative text-gray-600"
                                                    icon={faPlus}
                                                />
                                            </div>
                                        </span>
                                        <span className="inline pl-5 -mt-5 text-sm text-gray-700 cursor-pointer hover:underline">
                                            Ontwerp maken
                                        </span>
                                    </Link>
                                </div>
                            ) : null}

                            {vigerendeDimensieObject !== null ? (
                                <ContainerDetail
                                    dimensieHistorie={dimensieHistorie}
                                    patchStatus={patchStatus}
                                    dataObject={vigerendeDimensieObject}
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titelEnkelvoud={titelEnkelvoud}
                                    dataReceived={dataReceived}
                                />
                            ) : null}

                            {/* Status Historie, hier zit ook een containerDetail in met de laatst gewijzigde versie */}
                            {dataReceived &&
                            dimensieHistorieSet &&
                            pageType === 'detail' ? (
                                <StatusHistorie
                                    patchStatus={patchStatus}
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titelEnkelvoud={titelEnkelvoud}
                                    dataReceived={dataReceived}
                                    dataObject={dataObject}
                                    overzichtSlug={overzichtSlug}
                                    dimensieHistorie={dimensieHistorie}
                                    vigerendeDimensieObject={
                                        vigerendeDimensieObject
                                    }
                                    vigerendeDimensieObjectIndex={
                                        vigerendeDimensieObjectIndex
                                    }
                                />
                            ) : null}
                        </div>

                        {dataReceived &&
                        dataObject &&
                        (dataObject.Opdrachtgever !== undefined ||
                            dataObject.Eigenaar_1 !== undefined ||
                            dataObject.Eigenaar_2 !== undefined ||
                            dataObject.Portefeuillehouder_1 !== undefined ||
                            dataObject.Portefeuillehouder_2 !== undefined) ? (
                            <EigenaarsDriehoek
                                dataObject={
                                    vigerendeDimensieObject
                                        ? vigerendeDimensieObject
                                        : dataObject
                                }
                            />
                        ) : null}
                    </div>
                ) : (
                    <LoaderContent />
                )}
            </div>
        </ContainerMain>
    )
}

export default MuteerUniversalObjectDetailWithStatuses
