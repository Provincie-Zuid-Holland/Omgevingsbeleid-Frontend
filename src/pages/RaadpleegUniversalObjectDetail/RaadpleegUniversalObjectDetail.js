import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
import {
    faEllipsisV,
    faAngleRight,
    faAngleLeft,
    faClock,
    faTimes,
    faFileDownload,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { PDFDownloadLink } from '@react-pdf/renderer'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import ContentTekst from './ContentTekst'
import PDFDocument from './PDFDocument'
import LeafletTinyViewer from './../../components/LeafletTinyViewer'
import LeafletLargeViewer from './LeafletLargeViewer'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'
import LoaderContent from './../../components/LoaderContent'
import LoaderSmallSpan from './../../components/LoaderSmallSpan'
import PopUpAnimatedContainer from './../../components/PopUpAnimatedContainer'

// Import view containers
import ContainerViewFieldsBeleidsbeslissing from './ContainerFields/ContainerViewFieldsBeleidsbeslissing'
import ContainerViewFieldsBeleidsregel from './ContainerFields/ContainerViewFieldsBeleidsregel'
import ContainerViewFieldsMaatregel from './ContainerFields/ContainerViewFieldsMaatregel'
import ContainerViewFieldsOpgave from './ContainerFields/ContainerViewFieldsOpgave'
import ContainerViewFieldsAmbitie from './ContainerFields/ContainerViewFieldsAmbitie'
import ContainerViewFieldsBelang from './ContainerFields/ContainerViewFieldsBelang'
import ContainerViewFieldsThema from './ContainerFields/ContainerViewFieldsThema'

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
            fullscreenLeafletViewer: false,
            downloadPDF: false,
        }
        this.toggleFullscreenLeafletViewer = this.toggleFullscreenLeafletViewer.bind(
            this
        )
        this.toggleDownloadPDF = this.toggleDownloadPDF.bind(this)
        this.initializeComponent = this.initializeComponent.bind(this)
    }

    toggleDownloadPDF() {
        this.setState({
            downloadPDF: !this.state.downloadPDF,
        })
    }

    toggleFullscreenLeafletViewer() {
        this.setState({
            fullscreenLeafletViewer: !this.state.fullscreenLeafletViewer,
        })
    }

    initializeComponent() {
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

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data[0]
                const revisieObjecten = res.data
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
                    } else if (error.response.status === 404) {
                        this.props.history.push(`/`)
                        toast(
                            `Deze ${this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()} kon niet gevonden worden`
                        )
                    } else if (error.response.status === 422) {
                        this.props.history.push(`/login`)
                        toast(
                            `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                        )
                    }
                    this.setState({
                        dataLoaded: true,
                    })
                } else {
                    this.setState({
                        dataLoaded: true,
                    })
                    toast(`Er is iets misgegaan`)
                }
            })
    }

    componentDidMount() {
        this.initializeComponent()
    }

    componentDidUpdate(prevProps) {
        console.log('PROP CHANGE!')
        console.log(prevProps)
        console.log(this.props)
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.initializeComponent()
        }
    }

    render() {
        const dataObject = this.state.dataObject
        const dataLoaded = this.state.dataLoaded
        let werkingsgebiedBoolean = false

        // Werkingsgebieden zijn er bij de volgende objecten:
        // - Beleidsbeslissing
        if (
            dataObject !== null &&
            (dataObject.Gebied ||
                (dataObject.WerkingsGebieden && dataObject.WerkingsGebieden[0]))
        ) {
            werkingsgebiedBoolean = true
        } else {
            werkingsgebiedBoolean = false
        }

        let werkingsGebiedUUID = null

        if (werkingsgebiedBoolean && dataObject.Gebied) {
            werkingsGebiedUUID = dataObject.Gebied
        } else if (
            werkingsgebiedBoolean &&
            dataObject.WerkingsGebieden &&
            dataObject.WerkingsGebieden[0]
        ) {
            werkingsGebiedUUID = dataObject.WerkingsGebieden[0].UUID
        }

        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud

        let hashBool = false
        let searchQuery = null
        if (window.location.hash) {
            console.log(window.location.hash)
            hashBool = true
            searchQuery = window.location.hash.substr(1)
        }

        return (
            <div
                className="container mx-auto flex px-6 pb-20 mt-8"
                id="raadpleeg-detail-container-main"
            >
                <Helmet>
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
                <div className="w-1/4" id="raadpleeg-detail-sidebar">
                    {!this.state.fullscreenLeafletViewer ? (
                        <React.Fragment>
                            {hashBool ? (
                                <ButtonBackToPage
                                    terugNaar="zoeken"
                                    url={`/zoekresultaten?query=${searchQuery}`}
                                />
                            ) : (
                                <ButtonBackToPage
                                    terugNaar="startpagina"
                                    url="/"
                                />
                            )}
                            <h2 className="text-gray-800 mt-6 text-l font-serif block">
                                Gerelateerde{' '}
                                {this.props.dataModel.variables.Titel_Meervoud}
                            </h2>
                            <ul className="mt-4 pr-8">
                                <li className="mt-2 text-gray-700">
                                    <span className="text-sm block">
                                        Hier komen gerelateerde{' '}
                                        {
                                            this.props.dataModel.variables
                                                .Titel_Meervoud
                                        }
                                    </span>
                                </li>
                            </ul>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <span
                                onClick={this.toggleFullscreenLeafletViewer}
                                className="text-l mb-2 inline-block text-gray-600 cursor-pointer pr-5"
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faAngleLeft}
                                />
                                <span>Terug naar artikelpagina</span>
                            </span>
                        </React.Fragment>
                    )}
                </div>
                {dataLoaded ? (
                    <div
                        id="raadpleeg-detail-container-content"
                        className={werkingsgebiedBoolean ? `w-2/4` : `w-3/4`}
                    >
                        {/* Artikel Headers */}
                        <span className="text-l font-serif block text-gray-800">
                            {this.props.dataModel.variables.Titel_Enkelvoud}
                        </span>
                        <h1
                            id="raadpleeg-detail-header-one"
                            className="mt-2 heading-serif-2xl text-gray-800"
                        >
                            {dataObject.Titel}
                        </h1>

                        {/* Meta Content */}
                        <div
                            className="mb-8 block"
                            id="raadpleeg-detail-container-meta-info"
                        >
                            {/* <span className="text-gray-600 text-sm mr-3">
                                Vigerend sinds{' '}
                                {format(
                                    new Date(dataObject.Begin_Geldigheid),
                                    'D MMM YYYY'
                                )}
                            </span> */}
                            {dataLoaded ? (
                                <span className="text-gray-600 text-sm mr-3">
                                    {dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
                                              ),
                                              'D MMMM YYYY',
                                              { locale: nlLocale }
                                          )
                                        : 'Er is nog geen begin geldigheid'}
                                </span>
                            ) : (
                                <span className="mt-2 block">
                                    <LoaderSmallSpan />
                                </span>
                            )}
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
                                                        content={
                                                            dataObject[
                                                                'Begin_Geldigheid'
                                                            ] !== null
                                                                ? format(
                                                                      new Date(
                                                                          dataObject[
                                                                              'Begin_Geldigheid'
                                                                          ]
                                                                      ),
                                                                      'D MMM YYYY',
                                                                      {
                                                                          locale: nlLocale,
                                                                      }
                                                                  )
                                                                : 'Er is nog geen begin geldigheid'
                                                        }
                                                        color="orange"
                                                        current={true}
                                                    />
                                                ) : (
                                                    <RevisieListItem
                                                        content={
                                                            dataObject[
                                                                'Begin_Geldigheid'
                                                            ] !== null
                                                                ? format(
                                                                      new Date(
                                                                          dataObject[
                                                                              'Begin_Geldigheid'
                                                                          ]
                                                                      ),
                                                                      'D MMM YYYY',
                                                                      {
                                                                          locale: nlLocale,
                                                                      }
                                                                  )
                                                                : 'Er is nog geen begin geldigheid'
                                                        }
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
                            <span
                                onClick={this.toggleDownloadPDF}
                                className="text-gray-600 text-sm mr-3 cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faFileDownload}
                                />
                                Download als PDF
                            </span>
                            {this.state.downloadPDF ? (
                                <PopUpAnimatedContainer small={true}>
                                    <React.Fragment>
                                        <span
                                            className="text-gray-800 p-4 absolute right-0 top-0 cursor-pointer"
                                            onClick={this.toggleDownloadPDF}
                                        >
                                            <FontAwesomeIcon
                                                className="mr-2"
                                                icon={faTimes}
                                            />
                                        </span>
                                        <PDFDownloadLink
                                            document={
                                                <PDFDocument
                                                    dataObject={dataObject}
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    titel={dataObject.Titel}
                                                />
                                            }
                                            className="text-gray-600 text-sm mr-3"
                                            fileName="test.pdf"
                                        >
                                            {({ blob, url, loading, error }) =>
                                                loading ? (
                                                    <React.Fragment>
                                                        <FontAwesomeIcon
                                                            className="mr-2"
                                                            icon={
                                                                faFileDownload
                                                            }
                                                        />
                                                        PDF Genereren...
                                                    </React.Fragment>
                                                ) : (
                                                    <div className="p-4 text-center">
                                                        <div>
                                                            Hier kunt u
                                                            binnenkort het PDF
                                                            bestand downloaden .{' '}
                                                            {/* De PDF is
                                                            gegenereerd. Klik
                                                            hier om deze te
                                                            downloaden. */}
                                                        </div>
                                                        {/* <span className="text-white inline-block bg-green-600 px-4 py-2 rounded mt-4">
                                                            <FontAwesomeIcon
                                                                className="mr-2"
                                                                icon={
                                                                    faFileDownload
                                                                }
                                                            />
                                                            Download
                                                        </span> */}
                                                    </div>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    </React.Fragment>
                                </PopUpAnimatedContainer>
                            ) : null}
                            <span className="text-gray-600 text-sm mr-3">
                                &bull;
                            </span>
                            <span
                                className="text-gray-600 text-sm mr-3 cursor-pointer"
                                onClick={() => window.print()}
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faPrint}
                                />
                                Afdrukken
                            </span>
                        </div>

                        {/* Inhoud Sectie */}
                        {titelEnkelvoud === 'Beleidsbeslissing' ? (
                            <ContainerViewFieldsBeleidsbeslissing
                                crudObject={dataObject}
                            />
                        ) : null}

                        {titelEnkelvoud === 'Beleidsregel' ? (
                            <ContainerViewFieldsBeleidsregel
                                crudObject={dataObject}
                            />
                        ) : null}

                        {titelEnkelvoud === 'Maatregel' ? (
                            <ContainerViewFieldsMaatregel
                                crudObject={dataObject}
                            />
                        ) : null}

                        {titelEnkelvoud === 'Opgave' ? (
                            <ContainerViewFieldsOpgave
                                crudObject={dataObject}
                            />
                        ) : null}

                        {/*  */}
                        {titelEnkelvoud === 'Ambitie' ? (
                            <ContainerViewFieldsAmbitie
                                crudObject={dataObject}
                            />
                        ) : null}

                        {titelEnkelvoud === 'Belang' ? (
                            <ContainerViewFieldsBelang
                                crudObject={dataObject}
                            />
                        ) : null}

                        {titelEnkelvoud === 'Thema' ? (
                            <ContainerViewFieldsThema crudObject={dataObject} />
                        ) : null}

                        {titelEnkelvoud === 'Beleidsbeslissing' ? (
                            <RelatieComponent
                                crudObject={dataObject}
                                urlParam={this.props.match.params.id}
                            />
                        ) : null}
                    </div>
                ) : (
                    <LoaderContent />
                )}
                {dataLoaded && werkingsgebiedBoolean ? (
                    <div
                        className="w-1/4 pl-8"
                        id="raadpleeg-detail-werkingsgebied"
                    >
                        <div className="flex justify-between items-center text-gray-800 pb-3">
                            <h2 className="text-l font-serif">
                                Werkingsgebied
                            </h2>
                            {dataLoaded ? (
                                <span
                                    className="text-xs cursor-pointer px-2"
                                    onClick={this.toggleFullscreenLeafletViewer}
                                >
                                    Bekijk in het groot
                                    <FontAwesomeIcon
                                        className="ml-2 text-gray-700"
                                        icon={faExternalLinkAlt}
                                    />
                                </span>
                            ) : null}
                        </div>

                        <div
                            id={`full-screen-leaflet-container-${this.state.fullscreenLeafletViewer}`}
                        >
                            <LeafletTinyViewer
                                gebiedType="Werkingsgebieden"
                                gebiedUUID={werkingsGebiedUUID}
                                fullscreen={this.state.fullscreenLeafletViewer}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}

class RelatieComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.initializeComponent = this.initializeComponent.bind(this)
    }

    initializeComponent() {
        const crudObject = this.props.crudObject

        // ***
        // Haal beleidsrelaties op
        axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${crudObject.UUID}`)
            .then(res => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map(relatie => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                            )
                            .then(response => {
                                relatie.data = response.data
                            })
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function(values) {
                        let newObject = that.state.koppelingenRelaties
                        if (
                            newObject.beleidsbeslissingen &&
                            newObject.beleidsbeslissingen.length > 0
                        ) {
                            newObject.beleidsbeslissingen.concat(
                                beleidsrelaties
                            )
                        } else {
                            newObject.beleidsbeslissingen = beleidsrelaties
                        }
                        that.setState(
                            {
                                koppelingenRelaties: newObject,
                            },
                            () => console.log(that.state)
                        )
                    })
                }
            })

        axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${crudObject.UUID}`)
            .then(res => {
                let beleidsrelaties = res.data

                if (res.data.length > 0) {
                    const axiosGETArray = res.data.map(relatie => {
                        return axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                            )
                            .then(response => {
                                relatie.data = response.data
                            })
                    })

                    const that = this

                    Promise.all(axiosGETArray).then(function(values) {
                        let newObject = that.state.koppelingenRelaties
                        if (
                            newObject.beleidsbeslissingen &&
                            newObject.beleidsbeslissingen.length > 0
                        ) {
                            newObject.beleidsbeslissingen.concat(
                                beleidsrelaties
                            )
                        } else {
                            newObject.beleidsbeslissingen = beleidsrelaties
                        }
                        that.setState(
                            {
                                koppelingenRelaties: newObject,
                            },
                            () => console.log(that.state)
                        )
                    })
                }
            })

        // ***
        // Haal alle koppelingen en relaties op
        const koppelingRelatieArray = [
            'ambities',
            'opgaven',
            'themas',
            'beleidsregels',
            'doelen',
            'maatregelen',
            'verordening',
        ]

        let actieveKoppelingOfRelaties = []

        // Voor elk item in de koppelingRelatieArray kijken we of deze al een actieve koppeling heeft op het gekregen crudObject
        koppelingRelatieArray.forEach(item => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName] !== null &&
                crudObject[propertyName].length > 0 &&
                !actieveKoppelingOfRelaties.includes(
                    objecten[item].propertyName
                )
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        let propertyNamesMapped = []

        // Het object waar de nieuwe koppeling en relatie state in gemaakt wordt
        let newStateKoppelingenRelatiesObject = {}

        actieveKoppelingOfRelaties.forEach(propertyName => {
            // Als er al over de propertyName is gemapped return'en we
            if (propertyNamesMapped.includes(propertyName)) {
                return
            }

            // Anders voegen we de nieuwe propertyName aan de propertyNamesMapped
            propertyNamesMapped.push(propertyName)

            // !!!
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0
            ) {
                newStateKoppelingenRelatiesObject[propertyName] = []
                crudObject[propertyName].forEach((item, index) => {
                    newStateKoppelingenRelatiesObject[propertyName].push(item)
                })
            }
        })

        const that = this

        // Functie om de .data property toe te voegen aan het object
        function findPropertyAndAddDataToStateObject(propertyName, data) {
            const objectIndex = newStateKoppelingenRelatiesObject[
                propertyName
            ].findIndex(x => x.UUID === data.UUID)

            newStateKoppelingenRelatiesObject[propertyName][
                objectIndex
            ].data = data

            // Als het het laatste item is wat geupdate wordt updaten we nog een keer de state, zodat de .data properties op alle objecten zitten en geupdate worden in de state, en dus in de UI
            that.setState(
                {
                    koppelingenRelaties: newStateKoppelingenRelatiesObject,
                },
                () => console.log(that.state)
            )
        }

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken
        // Deze worden gereturned in een Promise.all()
        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName].map(
                    (koppeling, indexKoppeling) => {
                        if (
                            objecten[propertyName.toLowerCase()] === undefined
                        ) {
                            return null
                        }

                        axios
                            .get(
                                `${
                                    objecten[propertyName.toLowerCase()].api
                                }/version/${koppeling.UUID}`
                            )
                            .then(res => {
                                findPropertyAndAddDataToStateObject(
                                    propertyName,
                                    res.data
                                )
                            })
                    }
                )
            )
        )
            .then(responses => {
                this.setState(
                    {
                        dataFromAPILoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(err => console.log(err))
    }
    componentDidUpdate(prevProps) {
        if (prevProps.crudObject !== this.props.crudObject) {
            console.log('UPDATE')
            this.initializeComponent()
        }
    }
    componentDidMount() {
        this.initializeComponent()
    }
    render() {
        const that = this
        const verticalLayoutBool =
            this.state.koppelingenRelaties &&
            Object.keys(this.state.koppelingenRelaties).length > 4
        return (
            <div className="mt-8">
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif">
                    Relaties binnen de omgevingsvisie
                </h2>
                {verticalLayoutBool ? (
                    <ul
                        className={`mt-3 
                ${verticalLayoutBool ? 'flex-row' : 'flex'}`}
                    >
                        {this.state.koppelingenRelaties
                            ? Object.keys(this.state.koppelingenRelaties).map(
                                  function(key, index) {
                                      if (
                                          index === 0 &&
                                          !that.state
                                              .activeSectionInitialized &&
                                          !that.state.activeSection
                                      ) {
                                          that.setState({
                                              activeSection: key,
                                              activeSectionInitialized: true,
                                          })
                                      }
                                      return (
                                          <React.Fragment>
                                              <TabbladRelatieComponent
                                                  verticalLayoutBool={
                                                      verticalLayoutBool
                                                  }
                                                  activeSection={
                                                      that.state.activeSection
                                                  }
                                                  Titel={key}
                                                  Length={
                                                      that.state
                                                          .koppelingenRelaties[
                                                          key
                                                      ].length
                                                  }
                                                  click={() => {
                                                      that.setState({
                                                          activeSection: key,
                                                      })
                                                  }}
                                              />
                                              <TabbladInhoudRelatieComponent
                                                  verticalLayoutBool={
                                                      verticalLayoutBool
                                                  }
                                                  activeSection={
                                                      that.state.activeSection
                                                  }
                                                  array={
                                                      that.state
                                                          .koppelingenRelaties[
                                                          key
                                                      ]
                                                  }
                                                  titel={key}
                                              />
                                          </React.Fragment>
                                      )
                                  }
                              )
                            : null}
                    </ul>
                ) : (
                    <React.Fragment>
                        <ul className={`mt-3 flex`}>
                            {this.state.koppelingenRelaties
                                ? Object.keys(
                                      this.state.koppelingenRelaties
                                  ).map(function(key, index) {
                                      if (
                                          index === 0 &&
                                          !that.state
                                              .activeSectionInitialized &&
                                          !that.state.activeSection
                                      ) {
                                          that.setState({
                                              activeSection: key,
                                              activeSectionInitialized: true,
                                          })
                                      }
                                      return (
                                          <TabbladRelatieComponent
                                              verticalLayoutBool={
                                                  verticalLayoutBool
                                              }
                                              activeSection={
                                                  that.state.activeSection
                                              }
                                              Titel={key}
                                              Length={
                                                  that.state
                                                      .koppelingenRelaties[key]
                                                      .length
                                              }
                                              click={() => {
                                                  that.setState({
                                                      activeSection: key,
                                                  })
                                              }}
                                          />
                                      )
                                  })
                                : null}
                        </ul>
                        {this.state.koppelingenRelaties
                            ? Object.keys(this.state.koppelingenRelaties).map(
                                  function(key, index) {
                                      return (
                                          <TabbladInhoudRelatieComponent
                                              verticalLayoutBool={
                                                  verticalLayoutBool
                                              }
                                              activeSection={
                                                  that.state.activeSection
                                              }
                                              array={
                                                  that.state
                                                      .koppelingenRelaties[key]
                                              }
                                              titel={key}
                                          />
                                      )
                                  }
                              )
                            : null}
                    </React.Fragment>
                )}
            </div>
        )
    }
}

function TabbladRelatieComponent(props) {
    const borderStyles = props.verticalLayoutBool
        ? 'border-l-2 border-blue-600'
        : 'border-b-2 border-blue-600'
    const borderStylesActiveSection = props.verticalLayoutBool
        ? 'border-l-2 border-white'
        : 'border-b-2 border-white'

    return (
        <li
            onClick={props.click}
            className={`py-2 pl-2 mb-2 pr-6 cursor-pointer ${
                props.activeSection === props.Titel
                    ? borderStyles
                    : borderStylesActiveSection
            }`}
        >
            <span className="text-gray-700 font-bold text-lg block">
                {props.Titel.charAt(0).toUpperCase() + props.Titel.substring(1)}
            </span>
            <span className="text-gray-600 text-sm block">
                {props.Length} gekoppeld
            </span>
        </li>
    )
}

function TabbladInhoudRelatieComponent(props) {
    if (props.activeSection === props.titel) {
        return (
            <ul className={`${props.activeSection ? 'mb-3' : ''}`}>
                {props.array.map(relatie => {
                    console.log(relatie)
                    return (
                        <li className="py-2 pl-2 pr-6 border-b border-gray-300 hover:underline relative">
                            <Link
                                to={`/detail/${props.titel.toLowerCase()}/${
                                    relatie.data ? relatie.data.ID : '0'
                                }`}
                                to={
                                    relatie.data
                                        ? `/detail/${props.titel.toLowerCase()}/${
                                              relatie.data.ID
                                          }`
                                        : '#'
                                }
                            >
                                <span className="text-gray-700 block">
                                    {relatie.data ? (
                                        relatie.data.Titel
                                    ) : (
                                        <LoaderSmallSpan />
                                    )}
                                </span>
                                <FontAwesomeIcon
                                    className="absolute right-0 top-0 mt-3 mr-2  text-gray-600"
                                    icon={faAngleRight}
                                />
                            </Link>
                        </li>
                    )
                })}
            </ul>
        )
    } else {
        return null
    }
}

const objecten = {
    belangen: {
        buttonTekst: 'belang',
        volledigeTitel: 'Nationaal Belang',
        volledigeTitelMeervoud: 'Nationale Belangen',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Nationaal Belang',
        propertyName: 'Belangen',
        type: 'Nationaal Belang',
    },
    taken: {
        buttonTekst: 'taak',
        volledigeTitel: 'Wettelijke taken & bevoegdheden',
        volledigeTitelMeervoud: 'Wettelijke taken & bevoegdheden',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Wettelijke Taak & Bevoegdheid',
        propertyName: 'Belangen',
        type: 'Wettelijke Taak & Bevoegdheid',
    },
    ambities: {
        buttonTekst: 'ambities',
        volledigeTitel: 'Ambities',
        volledigeTitelMeervoud: 'Ambities',
        api: '/ambities',
        propertyName: 'Ambities',
        type: 'Ambitie',
    },
    opgaven: {
        buttonTekst: 'opgaven',
        volledigeTitel: 'Opgaven',
        volledigeTitelMeervoud: 'Opgaven',
        api: '/opgaven',
        propertyName: 'Opgaven',
        type: 'Opgave',
    },
    themas: {
        buttonTekst: 'themas',
        volledigeTitel: 'Themas',
        volledigeTitelMeervoud: 'Themas',
        api: '/themas',
        propertyName: 'Themas',
        type: 'Thema',
    },
    doelen: {
        buttonTekst: 'doelen',
        volledigeTitel: 'Doelen',
        volledigeTitelMeervoud: 'Doelen',
        api: '/doelen',
        propertyName: 'Doelen',
        type: 'Doel',
    },
    maatregelen: {
        buttonTekst: 'maatregelen',
        volledigeTitel: 'Maatregelen',
        volledigeTitelMeervoud: 'Maatregelen',
        api: '/maatregelen',
        propertyName: 'Maatregelen',
        type: 'Maatregel',
    },
    verordening: {
        buttonTekst: 'verordeningen',
        volledigeTitel: 'Verordening',
        volledigeTitelMeervoud: 'Verordeningen',
        api: '/verordeningen',
        propertyName: 'Verordening',
        type: 'Verordening',
    },
    beleidsregels: {
        buttonTekst: 'beleidsregels',
        volledigeTitel: 'Beleidsregels',
        volledigeTitelMeervoud: 'Beleidsregels',
        api: '/beleidsregels',
        propertyName: 'BeleidsRegels',
        type: 'Beleidsregel',
    },
}

export default RaadpleegUniversalObjectDetail
