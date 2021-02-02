import React from 'react'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
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

    const [dataObject, setDataObject] = React.useState(null)

    // Contains the history of an object (all the edits)
    const [revisieObjecten, setRevisieObjecten] = React.useState(null)

    // Boolean if data is loaded
    const [dataLoaded, setDataLoaded] = React.useState(false)

    // Boolean to toggle the large view
    const [
        fullscreenLeafletViewer,
        setFullscreenLeafletViewer,
    ] = React.useState(false)

    const ApiEndpointBase = dataModel.API_ENDPOINT
    const apiEndpoint = `${ApiEndpointBase}/version/${id}`
    const titleSingular = dataModel.TITLE_SINGULAR

    // Init when url param { id } changes
    React.useEffect(() => {
        setDataLoaded(false)

        axios
            .get(apiEndpoint)
            .then((res) => {
                const dataObject = res.data
                const revisieObjecten = res.data
                setDataObject(dataObject)
                setRevisieObjecten(revisieObjecten)
                setDataLoaded(true)
                window.scrollTo(0, 0)
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

    // Returns boolean
    // There are two objects with werkingsgebieden:
    // - Maatregelen
    // - Beleidskeuzes (also known as beleidsbeslissingen)
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
                className="container flex w-full px-6 mx-auto mt-8 mb-16 md:max-w-4xl"
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
                >
                    <div
                        id="raadpleeg-detail-container-content"
                        className={`w-full pt-6`}
                    >
                        <div className="container absolute inset-x-0 hidden w-full px-6 mx-auto xl:flex">
                            <div className="pl-3">
                                <BackButton
                                    fromPage={fromPage}
                                    searchQuery={searchQuery}
                                />
                            </div>
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
                            dataLoaded={dataLoaded}
                            revisieObjecten={revisieObjecten}
                            dataObject={dataObject}
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
            className={`text-gray-500 hover:text-gray-800 transition-colors duration-150 ease-in mb-4 inline-block`}
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
            <div className="flex items-center justify-between pb-3 text-gray-800">
                <h2 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
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
            <span className="block text-xl font-bold opacity-25 text-primary-super-dark">
                {type}
            </span>
            <h1
                id="raadpleeg-detail-header-one"
                className="mt-1 text-4xl font-semibold text-primary-super-dark "
            >
                {titel}
            </h1>
        </React.Fragment>
    )
}

const MetaInfo = ({ revisieObjecten, dataObject }) => {
    return (
        <div className="block mt-2" id="raadpleeg-detail-container-meta-info">
            <span className="mr-3 text-sm text-gray-800 opacity-75">
                {dataObject['Begin_Geldigheid']
                    ? 'Vigerend sinds ' +
                      format(
                          new Date(dataObject['Begin_Geldigheid']),
                          'd MMMM yyyy',
                          { locale: nlLocale }
                      )
                    : 'Er is nog geen begin geldigheid'}
            </span>

            {revisieObjecten && revisieObjecten.length > 0 ? (
                <React.Fragment>
                    <span className="mr-3 text-sm text-gray-600">&bull;</span>
                    <PopUpRevisieContainer
                        aantalRevisies={revisieObjecten.length - 1}
                    >
                        {revisieObjecten.map((item, index) => (
                            <RevisieListItem
                                key={dataObject.UUID}
                                content={
                                    dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
                                              ),
                                              'd MMM yyyy',
                                              {
                                                  locale: nlLocale,
                                              }
                                          )
                                        : 'Er is nog geen begin geldigheid'
                                }
                                color={index === 0 ? 'orange' : 'blue'}
                                current={index === 0 ? true : false}
                            />
                        ))}
                    </PopUpRevisieContainer>
                </React.Fragment>
            ) : null}
        </div>
    )
}

function RevisieListItem(props) {
    return (
        <li className="py-2">
            <span
                className={`inline-block w-4 h-4 bg-${props.color}-500 rounded-full mt-1 absolute`}
            />
            <span
                className={`pl-6 text-sm ${props.current ? 'font-bold' : null}`}
            >
                {props.content}
            </span>
        </li>
    )
}

export default RaadpleegUniversalObjectDetail
