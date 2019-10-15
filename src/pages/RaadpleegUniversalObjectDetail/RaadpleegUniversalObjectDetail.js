import React, { Component } from 'react'
import { format } from 'date-fns'
import {
    faAngleRight,
    faClock,
    faFileDownload,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import ContentTekst from './ContentTekst'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'
import LoaderContent from './../../components/LoaderContent'

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

class RaadpleegUniversalObjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            revisieObjecten: null,
            dataLoaded: false,
        }
    }
    componentDidMount() {
        // Nodig voor API Call:
        // Type object nodig
        // Object ID nodig

        const ApiEndpointBase = this.props.dataModel.variables.Api_Endpoint
        let apiEndpoint = ''

        // @@ Stuk code voor Version view implementatie @@
        // if (this.state.pageType === 'detail') {
        //     let detail_id = this.props.match.params.single
        //     apiEndpoint = `${ApiEndpointBase}/${detail_id}`
        // } else if (this.state.pageType === 'version') {
        //     let version_id = this.props.match.params.version
        //     apiEndpoint = `${ApiEndpointBase}/version/${version_id}`
        // }

        let detail_id = this.props.match.params.id
        apiEndpoint = `${ApiEndpointBase}/${detail_id}`

        console.log(apiEndpoint)

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data[0]
                const revisieObjecten = res.data
                console.log(dataObject)
                this.setState(
                    {
                        dataObject: dataObject,
                        revisieObjecten: revisieObjecten,
                        dataLoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(error => {
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('access_token')
                        this.props.history.push('/login')
                    }
                } else {
                    this.setState({
                        dataLoaded: true,
                    })
                }
            })
    }
    render() {
        const dataObject = this.state.dataObject
        const dataLoaded = this.state.dataLoaded
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-8">
                <div className="w-1/4">
                    <ButtonBackToPage terugNaar="startpagina" url="/" />
                    <h2 className="text-gray-800 mt-6 text-l font-serif block">
                        Gerelateerde{' '}
                        {this.props.dataModel.variables.Titel_Meervoud}
                    </h2>
                    <ul className="mt-4 pr-8">
                        <li className="mt-2 text-gray-700">
                            <span className="text-sm block">
                                Hier komen gerelateerde{' '}
                                {this.props.dataModel.variables.Titel_Meervoud}
                            </span>
                        </li>
                    </ul>
                </div>

                {dataLoaded ? (
                    <div
                        className={
                            dataObject.Werkingsgebied ? `w-2/4` : `w-3/4`
                        }
                    >
                        {/* Artikel Headers */}
                        <span className="text-l font-serif block text-gray-800 mt-8">
                            {this.props.dataModel.variables.Titel_Enkelvoud}
                        </span>
                        <h1 className="mt-2 heading-serif-2xl">
                            {dataObject.Titel}
                        </h1>

                        {/* Meta Content */}
                        <div>
                            <span className="text-gray-600 text-sm mr-3">
                                Vigerend sinds{' '}
                                {format(
                                    new Date(dataObject.Begin_Geldigheid),
                                    'D MMM YYYY'
                                )}
                            </span>
                            {this.state.revisieObjecten &&
                            this.state.revisieObjecten.length > 0 ? (
                                <React.Fragment>
                                    <span className="text-gray-600 text-sm mr-3">
                                        &bull;
                                    </span>
                                    <PopUpRevisieContainer
                                        aantalRevisies={
                                            this.state.revisieObjecten.length -
                                            1
                                        }
                                    >
                                        {this.state.revisieObjecten.map(
                                            (item, index) =>
                                                index === 0 ? (
                                                    <RevisieListItem
                                                        content={format(
                                                            new Date(
                                                                item.Begin_Geldigheid
                                                            ),
                                                            'D MMM YYYY'
                                                        )}
                                                        color="orange"
                                                        current={true}
                                                    />
                                                ) : (
                                                    <RevisieListItem
                                                        content={format(
                                                            new Date(
                                                                item.Begin_Geldigheid
                                                            ),
                                                            'D MMM YYYY'
                                                        )}
                                                        color="blue"
                                                    />
                                                )
                                        )}
                                    </PopUpRevisieContainer>
                                </React.Fragment>
                            ) : null}
                            <span className="text-gray-600 text-sm mr-3">
                                &bull;
                            </span>
                            <span className="text-gray-600 text-sm mr-3">
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faFileDownload}
                                />
                                Download als PDF
                            </span>
                            <span className="text-gray-600 text-sm mr-3">
                                &bull;
                            </span>
                            <span className="text-gray-600 text-sm mr-3">
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faPrint}
                                />
                                Afdrukken
                            </span>
                        </div>

                        {/* Inhoud Sectie */}
                        <div className="text-gray-800 py-5">
                            {dataObject.Omschrijving ? (
                                <ContentTekst
                                    content={dataObject.Omschrijving}
                                />
                            ) : null}
                        </div>

                        {/* Tags Sectie */}
                        {dataObject.Tags ? (
                            <div className="mt-8">
                                <h2 className="text-l font-serif block text-gray-800 mt-8">
                                    Tags
                                </h2>
                                <div className="flex mt-3">
                                    <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                                        Grondwater
                                    </div>
                                    <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                                        Grondwaterheffing
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <LoaderContent />
                )}
                {dataLoaded && dataObject.Werkingsgebied ? (
                    <div className="w-1/4 pl-8">
                        <div className="flex justify-between mt-8 text-gray-800">
                            <h2 className="text-l font-serif">
                                Werkingsgebied
                            </h2>
                            <span className="text-xs">
                                Bekijk in het groot
                                <FontAwesomeIcon
                                    className="ml-2 text-gray-700"
                                    icon={faExternalLinkAlt}
                                />
                            </span>
                        </div>
                        <div className="bg-orange-100 w-full h-64 block mt-4" />
                    </div>
                ) : null}
            </div>
        )
    }
}

export default RaadpleegUniversalObjectDetail
