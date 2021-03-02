import React from 'react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { Helmet } from 'react-helmet'
import {
    faArrowLeft,
    faExternalLinkAlt,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Transition } from '@headlessui/react'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import LeafletTinyViewer from './../../components/LeafletTinyViewer'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'
import LoaderContent from './../../components/LoaderContent'

// Import view containers
import ContainerViewFieldsBeleidsbeslissing from './ContainerFields/ContainerViewFieldsBeleidsbeslissing'
import ContainerViewFieldsBeleidsregel from './ContainerFields/ContainerViewFieldsBeleidsregel'
import ContainerViewFieldsMaatregel from './ContainerFields/ContainerViewFieldsMaatregel'
import ContainerViewFieldsOpgave from './ContainerFields/ContainerViewFieldsOpgave'
import ContainerViewFieldsAmbitie from './ContainerFields/ContainerViewFieldsAmbitie'
import ContainerViewFieldsBelang from './ContainerFields/ContainerViewFieldsBelang'
import ContainerViewFieldsThema from './ContainerFields/ContainerViewFieldsThema'
import ContainerViewFieldsBeleidsprestatie from './ContainerFields/ContainerViewFieldsBeleidsprestatie'
import ViewFieldGebiedDuiding from './ViewFieldGebiedDuiding'
import RelatiesKoppelingen from './RelatiesKoppelingen'

/**
 * A detail page for a dimensie object.
 * Every object has its own fields. For example the dimension Maatregelen has <ContainerViewFieldsMaatregel />)
 * @param {object} dataModel - Contains the dimensieConstants of the object (e.g. titleSingular)
 */
const RaadpleegUniversalObjectDetail = ({ dataModel }) => {
    let { id } = useParams()
    let history = useHistory()

    const [dataObject, setDataObject] = React.useState(null) // The object we want to display
    const [lineageID, setLineageID] = React.useState(null) // Used to get the whole history of the object

    // Contains the history of an object (all the edits)
    const [revisieObjecten, setRevisieObjecten] = React.useState(null)

    // Boolean if data is loaded
    const [dataLoaded, setDataLoaded] = React.useState(false)

    // Boolean to toggle the large view
    const [
        fullscreenLeafletViewer,
        setFullscreenLeafletViewer,
    ] = React.useState(false)

    const apiEndpointBase = dataModel.API_ENDPOINT
    const titleSingular = dataModel.TITLE_SINGULAR
    const apiEndpoint = `${apiEndpointBase}/version/${id}`

    React.useEffect(() => {
        if (!dataLoaded) return
        window.scrollTo(0, 0)
    }, [dataLoaded])

    // Init when url param { id } changes
    React.useEffect(() => {
        setDataLoaded(false)

        axios
            .get(apiEndpoint)
            .then((res) => {
                const dataObject = res.data
                setDataObject(dataObject)
                return res.data.ID
            })
            .then((newLineageID) => {
                if (newLineageID === lineageID) {
                    setDataLoaded(true)
                } else {
                    setLineageID(newLineageID)
                }
            })
            .catch((err) => {
                if (err.response !== undefined) {
                    if (err.response.status === 404) {
                        history.push(`/`)
                        toast(
                            `Deze ${titleSingular.toLowerCase()} kon niet gevonden worden`
                        )
                    } else if (err.response.status === 422) {
                        history.push(`/login`)
                        toast(
                            `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                        )
                    } else {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }, [id, apiEndpoint, history, titleSingular])

    const prepRevisions = (revisions) => {
        const sortedRevisions = revisions.sort(
            (a, b) => new Date(b.Modified_Date) - new Date(a.Modified_Date)
        )

        const preppedRevisions = sortedRevisions.filter(
            (revision) => revision.Status === 'Vigerend'
        )

        const firstInspraakIndex = sortedRevisions.findIndex(
            (revision, index) => revision.Status === 'Ontwerp in inspraak'
        )

        const firstVigerendIndex = sortedRevisions.findIndex(
            (revision, index) => revision.Status === 'Vigerend'
        )

        // Give each object a uiStatus
        // We need this because the first object with a status of Vigerend is the current one, which is still 'Vigerend'
        // But the older objects with a status 'Vigerend', are actually archived
        // They keep their 'Vigerend' status, because we don't change the history in our dataModel
        // So after the first object with a status of 'Vigerend', we want to display a status of 'Archived' in the UI
        preppedRevisions.forEach((revision, index) => {
            if (index === 0) {
                // If it is the first item with a Status of 'Vigerend'
                revision.uiStatus = 'Vigerend'
            } else {
                revision.uiStatus = 'Gearchiveerd'
            }
        })

        // If one of the items doesn't exist, return
        if (firstInspraakIndex === -1 || firstVigerendIndex === -1)
            return preppedRevisions

        // Check if the item with a Status 'Ontwerp in inspraak' is newer,
        // then the last item with a Status of 'Vigerend'
        // If so, place this item on index 0
        if (firstInspraakIndex < firstVigerendIndex) {
            const firstInspraakItem = sortedRevisions[firstInspraakIndex]
            firstInspraakItem.uiStatus = 'In inspraak'
            preppedRevisions.splice(0, 0, firstInspraakItem)
        }

        return preppedRevisions
    }

    React.useEffect(() => {
        if (!lineageID && lineageID !== 0) return

        // We only want to show the revisions on the type of Beleidskeuze
        if (titleSingular !== 'Beleidskeuze') {
            setDataLoaded(true)
            return
        }

        axios
            .get(`${apiEndpointBase}/${lineageID}`)
            .then((res) => {
                const preppedRevisions = prepRevisions(res.data)
                setRevisieObjecten(preppedRevisions)
                setDataLoaded(true)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [lineageID, titleSingular])

    // Returns boolean
    // There are two objects with werkingsgebieden:
    // - Maatregelen
    // - Beleidskeuzes
    const checkIfObjectHasWerkingsgebied = () => {
        if (!dataLoaded || !dataObject) return false

        // Check if there is a werkingsgebied
        if (
            dataObject.Gebied ||
            (dataObject.WerkingsGebieden && dataObject.WerkingsGebieden[0])
        ) {
            return true
        } else {
            return false
        }
    }

    const getWerkingsgbiedUUID = (hasWerkingsGebied) => {
        if (!hasWerkingsGebied) return null

        if (dataObject.Gebied) {
            // Object is a maatregel, which contains the UUID in a string value
            return dataObject.Gebied
        } else if (
            dataObject.WerkingsGebieden &&
            dataObject.WerkingsGebieden[0]
        ) {
            // Object is a beleidskeuze/beleidsbeslissing, which holds the werkingsgebieden in an array.
            // We always need the first value in the array
            return dataObject.WerkingsGebieden[0].UUID
        }
    }

    const hasWerkingsGebied = checkIfObjectHasWerkingsgebied()
    const werkingsGebiedUUID = getWerkingsgbiedUUID(hasWerkingsGebied)

    const getSearchQuery = () => {
        let searchQuery = null

        const urlParams = new URLSearchParams(window.location.search)
        const fromPage = urlParams.get('fromPage')

        if (window.location.hash) {
            searchQuery = window.location.hash.substr(1)
        }

        return [searchQuery, fromPage]
    }

    const [searchQuery, fromPage] = getSearchQuery()

    const getTitle = () => {
        if (!dataLoaded) return ''

        return `${
            dataObject ? dataObject.Titel : null
        } (${titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
    }

    return (
        <React.Fragment>
            <div
                className="container flex w-full px-6 mx-auto mt-8 mb-12 md:max-w-3xl"
                id="raadpleeg-detail-container-main"
            >
                <Helmet>
                    <title>{getTitle()}</title>
                    <style type="text/css">{`
                    @media print {
                        #raadpleeg-detail-sidebar,
                        #raadpleeg-detail-werkingsgebied,
                        #navigation-main,
                        #raadpleeg-detail-container-meta-info {
                            display: none;
                        }
                        #raadpleeg-detail-container-main {
                            margin-top: 0px;
                        }
                        #raadpleeg-detail-container-content {
                            width: 100%;
                        }
                        #raadpleeg-detail-header-one {
                            margin-bottom: 2rem;
                        }
                    }                     
                `}</style>
                </Helmet>
                {!dataLoaded ? <LoaderContent /> : null}
                <Transition
                    show={dataLoaded}
                    enter="transition ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="w-full"
                >
                    <div
                        id="raadpleeg-detail-container-content"
                        className={`w-full`}
                    >
                        <div className="container absolute inset-x-0 hidden w-full mx-auto xl:flex">
                            <BackButton
                                fromPage={fromPage}
                                searchQuery={searchQuery}
                            />
                        </div>
                        <div className="block xl:hidden">
                            <BackButton
                                fromPage={fromPage}
                                searchQuery={searchQuery}
                            />
                        </div>

                        <Heading
                            type={titleSingular}
                            titel={dataObject ? dataObject.Titel : null}
                        />

                        {/* Meta Content */}
                        <MetaInfo
                            titleSingular={titleSingular}
                            dataLoaded={dataLoaded}
                            revisieObjecten={revisieObjecten}
                            dataObject={dataObject}
                            currentUUID={id}
                        />

                        {/* These contain the fields that need to be displayed for the different objects */}
                        <div
                            className={`mt-8 ${
                                titleSingular === 'Beleidskeuze' ? '' : 'pb-20'
                            }`}
                            id="raadpleeg-detail-container-main"
                        >
                            {titleSingular === 'Beleidskeuze' ? (
                                <ContainerViewFieldsBeleidsbeslissing
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Beleidsregel' ? (
                                <ContainerViewFieldsBeleidsregel
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Beleidsprestatie' ? (
                                <ContainerViewFieldsBeleidsprestatie
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Maatregel' ? (
                                <ContainerViewFieldsMaatregel
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Beleidsdoel' ? (
                                <ContainerViewFieldsOpgave
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Ambitie' ? (
                                <ContainerViewFieldsAmbitie
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Belang' ? (
                                <ContainerViewFieldsBelang
                                    crudObject={dataObject}
                                />
                            ) : null}
                            {titleSingular === 'Thema' ? (
                                <ContainerViewFieldsThema
                                    crudObject={dataObject}
                                />
                            ) : null}
                        </div>

                        {hasWerkingsGebied && dataLoaded ? (
                            <Werkingsgebied
                                fullscreenLeafletViewer={
                                    fullscreenLeafletViewer
                                }
                                setFullscreenLeafletViewer={
                                    setFullscreenLeafletViewer
                                }
                                werkingsGebiedUUID={werkingsGebiedUUID}
                            />
                        ) : null}
                        {titleSingular === 'Maatregel' &&
                        dataLoaded &&
                        dataObject['Gebied_Duiding'] &&
                        dataObject['Gebied'] ? (
                            <ViewFieldGebiedDuiding
                                gebiedDuiding={dataObject['Gebied_Duiding']}
                            />
                        ) : null}
                    </div>
                </Transition>
            </div>
            {dataLoaded && titleSingular === 'Beleidskeuze' ? (
                <RelatiesKoppelingen beleidskeuze={dataObject} />
            ) : null}
        </React.Fragment>
    )
}

const BackButton = ({ fromPage, searchQuery }) => {
    return (
        <Link
            to={
                searchQuery
                    ? `/zoekresultaten${searchQuery}`
                    : fromPage
                    ? fromPage
                    : '/'
            }
            className={`text-pzh-blue opacity-75 hover:opacity-100 transition-opacity ease-in duration-100 mb-4 inline-block`}
            id="button-back-to-previous-page"
        >
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            <span>Terug</span>
        </Link>
    )
}

const Werkingsgebied = ({
    fullscreenLeafletViewer,
    setFullscreenLeafletViewer,
    werkingsGebiedUUID,
}) => {
    return (
        <div className="w-full mt-8" id="raadpleeg-detail-werkingsgebied">
            <div className="flex items-center justify-between pb-3">
                <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                    Werkingsgebied
                </h2>
                <span
                    className="px-2 text-xs cursor-pointer"
                    onClick={() =>
                        setFullscreenLeafletViewer(!fullscreenLeafletViewer)
                    }
                >
                    Bekijk in het {fullscreenLeafletViewer ? 'klein' : 'groot'}
                    <FontAwesomeIcon
                        className="ml-2 text-gray-700"
                        icon={faExternalLinkAlt}
                    />
                </span>
            </div>

            <div
                className="overflow-hidden rounded-lg"
                id={`full-screen-leaflet-container-${fullscreenLeafletViewer}`}
            >
                <LeafletTinyViewer
                    gebiedType="Werkingsgebieden"
                    gebiedUUID={werkingsGebiedUUID}
                    fullscreen={fullscreenLeafletViewer}
                />
            </div>
        </div>
    )
}

const Heading = ({ type, titel }) => {
    return (
        <React.Fragment>
            <span className="block mb-2 text-xl font-bold opacity-25 text-pzh-blue">
                {type}
            </span>
            <h1
                id="raadpleeg-detail-header-one"
                className="mt-1 text-4xl font-bold text-pzh-blue "
            >
                {titel}
            </h1>
        </React.Fragment>
    )
}

const MetaInfo = ({
    revisieObjecten,
    dataObject,
    currentUUID,
    titleSingular,
}) => {
    const getVigerendText = () => {
        if (!dataObject['Begin_Geldigheid'])
            return 'Er is nog geen begin geldigheid'

        const textDate = format(
            new Date(dataObject['Begin_Geldigheid']),
            'd MMMM yyyy',
            {
                locale: nlLocale,
            }
        )
        const isActive =
            dataObject.Status && dataObject.Status === 'Vigerend'
                ? 'Vigerend sinds'
                : 'Vigerend vanaf'

        return isActive + ' ' + textDate
    }

    const vigerendText = getVigerendText()

    return (
        <div className="block" id="raadpleeg-detail-container-meta-info">
            <span className="mr-3 text-sm opacity-75 text-pzh-blue-dark">
                {vigerendText}
            </span>
        </div>
    )
}

function RevisieListItem({ item, currentUUID }) {
    const getDate = (item) => {
        return item['Begin_Geldigheid'] !== null
            ? format(new Date(item['Begin_Geldigheid']), 'd MMM yyyy', {
                  locale: nlLocale,
              })
            : 'Er is nog geen begin geldigheid'
    }

    const date = getDate(item)
    const status = item.uiStatus
    const isActive = item.UUID === currentUUID

    return (
        <li className={`bg-white ${isActive ? '' : 'hover:bg-gray-100'}`}>
            <Link
                className={`inline-block py-3 ${
                    isActive ? 'cursor-default' : ''
                }`}
                to={`/detail/beleidskeuzes/${item.UUID}`}
                onClick={(e) => {
                    if (isActive) {
                        e.preventDefault()
                        return
                    }
                }}
            >
                <span
                    className={`inline-block w-2 h-2 rounded-full mt-2 -ml-1 absolute ${
                        status === 'In inspraak'
                            ? 'bg-red-700'
                            : status === 'Vigerend'
                            ? 'bg-yellow-500 pulsate'
                            : status === 'Gearchiveerd'
                            ? 'bg-blue-900'
                            : ''
                    }`}
                />
                <span
                    className={`pl-6 text-sm ${isActive ? 'font-bold' : ''}`}
                >{`${status} (${date})`}</span>
            </Link>
        </li>
    )
}

export default RaadpleegUniversalObjectDetail
