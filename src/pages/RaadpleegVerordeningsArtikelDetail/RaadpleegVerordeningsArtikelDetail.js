import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
import {
    faAngleLeft,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import clonedeep from 'lodash.clonedeep'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import VerordeningenDetailSidebar from './VerordeningenDetailSidebar'
import LoaderSmallSpan from './../../components/LoaderSmallSpan'

class RaadpleegVerordeningsArtikelDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            dataLoaded: false,
            activeArtikel: null,
        }

        this.selectArtikel = this.selectArtikel.bind(this)

        this.changeActiveHoofdstuk = this.changeActiveHoofdstuk.bind(this)

        // Wordt gebruikt om de items in de verkregen verordeningsstructuur te populaten
        this.populateFieldsAndSetState = this.populateFieldsAndSetState.bind(
            this
        )
    }

    selectArtikel(type, hoofdstukIndex, nest1, nest2, nest3) {
        if (type !== 'Artikel') return

        this.setState({
            activeArtikel: [hoofdstukIndex, nest1, nest2, nest3],
        })
    }

    changeActiveHoofdstuk(hoofdstukNummer) {
        console.log(hoofdstukNummer)
        if (hoofdstukNummer !== null) {
            const parsedHoofdstukNummer = parseInt(hoofdstukNummer)
            // Het Parsed Hfst nummer doen we '- 1' om de index te verkrijgen
            this.setState({
                activeHoofdstuk: parsedHoofdstukNummer,
            })
        } else if (hoofdstukNummer === null) {
            this.setState({
                activeHoofdstuk: null,
            })
        }
    }

    populateFieldsAndSetState(lineage) {
        lineage.Status = 'TEST'

        let amountOfRequests = 0
        let amountOfRequestsSolved = 0

        const that = this

        function getDataAndPopulateObject(child) {
            amountOfRequests++

            axios
                .get(`/verordeningen/version/${child.UUID}`)
                .then(res => {
                    const object = res.data
                    child.ID = object.ID
                    child.Begin_Geldigheid = object.Begin_Geldigheid
                    child.Eind_Geldigheid = object.Eind_Geldigheid
                    child.Created_By = object.Created_By
                    child.Created_Date = object.Created_Date
                    child.Modified_By = object.Modified_By
                    child.Modified_Date = object.Modified_Date
                    child.Titel = object.Titel
                    child.Inhoud = object.Inhoud
                    child.Status = object.Status
                    child.Type = object.Type
                    child.Volgnummer = object.Volgnummer
                    child.Werkingsgebied = object.Werkingsgebied
                    child.Eigenaar_1 = object.Eigenaar_1
                    child.Eigenaar_2 = object.Eigenaar_2
                    child.Portefeuillehouder_1 = object.Portefeuillehouder_1
                    child.Portefeuillehouder_2 = object.Portefeuillehouder_2
                    child.Opdrachtgever = object.Opdrachtgever

                    amountOfRequestsSolved++

                    if (amountOfRequests === amountOfRequestsSolved) {
                        that.setState(
                            {
                                dataLoaded: true,
                                lineage: clonedeep(lineage),
                            },
                            () => console.log(that.state)
                        )
                    }
                })
                .catch(err => console.log(err))
        }

        function recursiveGetDataForChildren(child) {
            getDataAndPopulateObject(child)

            const hasChildren = child.Children.length > 0
            if (!hasChildren) return
            child.Children.map(childOfChild => {
                getDataAndPopulateObject(childOfChild)

                const hasChildren = childOfChild.Children.length > 0
                if (!hasChildren) return
                childOfChild.Children.map((recChild, index) => {
                    getDataAndPopulateObject(recChild)

                    const hasChildren = recChild.Children.length > 0
                    if (!hasChildren) return
                    recursiveGetDataForChildren(recChild)
                })
            })
        }

        lineage.Structuur.Children.map((child, index) => {
            const hasChildren = child.Children.length > 0
            if (hasChildren) {
                recursiveGetDataForChildren(child)
            } else {
                getDataAndPopulateObject(child)
            }
        })

        if (lineage.Structuur.Children.length === 0) {
            this.setState({
                dataLoaded: true,
                lineage: lineage,
            })
        }
    }

    componentDidMount() {
        const ID = this.props.match.params.lineageID

        // Get Lineage
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then(res => {
                // Get latest lineage
                const lineage = res.data[res.data.length - 1]
                this.populateFieldsAndSetState(lineage)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const dataLoaded = this.state.dataLoaded
        const activeArtikel = this.state.activeArtikel
        let artikel = null
        let hoofdstukNummer = null

        if (dataLoaded && activeArtikel) {
            // Selecteer het artikel. Het artikel kan in een Paragraaf zitten, maar ook in een Paragraaf die in een groep zit. Hieronder selecteren we het juiste Artikel
            if (activeArtikel[3] !== null) {
                artikel = this.state.lineage.Structuur.Children[
                    activeArtikel[0]
                ].Children[activeArtikel[1]].Children[activeArtikel[2]]
                    .Children[activeArtikel[3]]
            } else if (activeArtikel[2] !== null) {
                artikel = this.state.lineage.Structuur.Children[
                    activeArtikel[0]
                ].Children[activeArtikel[1]].Children[activeArtikel[2]]
            } else if (activeArtikel[1] !== null) {
                artikel = this.state.lineage.Structuur.Children[
                    activeArtikel[0]
                ].Children[activeArtikel[1]]
            }

            hoofdstukNummer = this.state.lineage.Structuur.Children[
                activeArtikel[0]
            ].Volgnummer
        }

        return (
            <div
                className="container mx-auto flex px-6 pb-20 mt-8"
                id="raadpleeg-detail-container-main"
            >
                <VerordeningenDetailSidebar
                    changeActiveHoofdstuk={this.changeActiveHoofdstuk}
                    activeHoofdstuk={this.state.activeHoofdstuk}
                    dataLoaded={this.state.dataLoaded}
                    lineage={this.state.lineage}
                    selectArtikel={this.selectArtikel}
                />
                {dataLoaded ? (
                    artikel !== null ? (
                        <div
                            id="raadpleeg-detail-container-content text-gray-800"
                            className={`w-3/4`}
                        >
                            {console.log(artikel)}
                            {/* Artikel Headers */}
                            <span className="text-l font-serif block text-gray-800">
                                Artikel {hoofdstukNummer}.{artikel.Volgnummer}
                            </span>
                            <h1
                                id="raadpleeg-detail-header-one"
                                className="mt-2 heading-serif-2xl text-gray-800"
                            >
                                {artikel.Titel}
                            </h1>

                            {/* Meta Content */}
                            <div
                                className="mb-8 block"
                                id="raadpleeg-detail-container-meta-info"
                            >
                                {dataLoaded ? (
                                    <span className="text-gray-600 text-sm mr-3">
                                        Vigerend sinds{' '}
                                        {format(
                                            new Date(artikel.Begin_Geldigheid),
                                            'DD-MMMM-YYYY',
                                            {
                                                locale: nlLocale,
                                            }
                                        )}
                                    </span>
                                ) : (
                                    <span className="mt-2 block">
                                        <LoaderSmallSpan />
                                    </span>
                                )}
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
                            <p className={`text-gray-700 text-sm mb-4`}>
                                {artikel.Inhoud}
                            </p>
                        </div>
                    ) : (
                        <span className="italic text-gray-700 w-3/4 inline-block">
                            Selecteer een artikel
                        </span>
                    )
                ) : null}
            </div>
        )
    }
}

export default withRouter(RaadpleegVerordeningsArtikelDetail)
