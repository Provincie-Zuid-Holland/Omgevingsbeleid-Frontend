import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import { faFolder, faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { faBook } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import LoaderContent from './../../components/LoaderContent'

import DragAndDropList from './DragAndDropList'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

class MuteerVerordeningenstructuurDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            lineage: null,
            activeHoofdstuk: null,
        }
        this.handleError = this.handleError.bind(this)
        this.changeActiveHoofdstuk = this.changeActiveHoofdstuk.bind(this)
        this.populateFieldsAndSetState = this.populateFieldsAndSetState.bind(
            this
        )
    }

    changeActiveHoofdstuk(hoofdstukNummer) {
        const parsedHoofdstukNummer = parseInt(hoofdstukNummer)
        // Het Parsed Hfst nummer doen we '- 1' om de index te verkrijgen
        this.setState({
            activeHoofdstuk: parsedHoofdstukNummer - 1,
        })
    }

    handleError(msg) {
        this.props.history.push('/muteer/verordeningen')
        toast(msg)
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
                        that.setState({
                            dataLoaded: true,
                            lineage: lineage,
                        })
                    }
                })
                .catch(err => console.log(err))
        }

        function recursiveGetDataForChildren(child) {
            getDataAndPopulateObject(child)

            child.Children.map(childOfChild => {
                getDataAndPopulateObject(childOfChild)

                const hasChildren = childOfChild.Children.length > 0
                if (hasChildren) {
                    childOfChild.Children.map((recChild, index) => {
                        getDataAndPopulateObject(recChild)

                        const hasChildren = recChild.Children.length > 0
                        if (hasChildren) {
                            recursiveGetDataForChildren(recChild.Children)
                        }
                    })
                }
            })
        }

        lineage.Structuur.Children.map((child, index) => {
            const hasChildren = child.Children.length > 0
            if (hasChildren) {
                recursiveGetDataForChildren(child)
            }
        })
    }

    componentDidMount() {
        // - GET structuur van verordening lineage - Query: /verordeningstructuur/:ID
        // - Populate elk verordeningsobject obv UUID met de version - Query:
        //     - /verordeningen/version/:UUID

        const ID = this.props.match.params.ID

        // Als het ID geen number -> push naar de overzichtspagina
        if (!ID || isNaN(ID)) {
            this.handleError('Deze verordening bestaat niet')
            return
        }

        // Get Lineage
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then(res => {
                // Handle empty res
                if (!res.data || !res.data[0]) {
                    this.handleError(
                        'Er ging iets fout, probeer het later opnieuw'
                    )
                    return
                }

                // Get latest lineage
                const lineage = res.data[0]
                this.populateFieldsAndSetState(lineage)
            })
            .catch(err =>
                this.handleError('Er ging iets fout, probeer het later opnieuw')
            )

        // axios.get('')
    }

    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - {`Beheer Verordening`}</title>
                </Helmet>

                <div className="w-1/4 inline-block flex-grow">
                    <div className="pl-6 relative">
                        <FontAwesomeIcon
                            className="absolute mt-1 left-0  text-gray-700"
                            icon={faBook}
                        />
                        <h1
                            className="text-sm text-gray-800 mb-4"
                            onClick={() => this.changeActiveHoofdstuk(null)}
                        >
                            Omgevingsverordening Zuid-Holland
                        </h1>
                        {this.state.dataLoaded ? (
                            <ul className="pl-6 relative">
                                {this.state.lineage.Structuur.Children.map(
                                    hoofdstuk => (
                                        <li>
                                            <FontAwesomeIcon
                                                className="absolute mt-1 left-0 text-gray-700"
                                                icon={faFolder}
                                            />
                                            <span
                                                onClick={() =>
                                                    this.changeActiveHoofdstuk(
                                                        hoofdstuk.Volgnummer
                                                    )
                                                }
                                                className="text-sm text-gray-800 mb-4 cursor-pointer"
                                            >
                                                Hoofdstuk {hoofdstuk.Volgnummer}{' '}
                                                - {hoofdstuk.Titel}
                                            </span>
                                            {hoofdstuk.Children.length > 0 ? (
                                                <ul className="pl-6 relative">
                                                    {hoofdstuk.Children.map(
                                                        child => (
                                                            <li
                                                                key={child.UUID}
                                                                className="mt-2"
                                                            >
                                                                <FontAwesomeIcon
                                                                    className="absolute mt-1 left-0 text-gray-700"
                                                                    icon={
                                                                        faFolder
                                                                    }
                                                                />
                                                                <span className="text-sm text-gray-800 mb-4">
                                                                    {
                                                                        child.Titel
                                                                    }
                                                                </span>
                                                                {child.Children
                                                                    .length >
                                                                0 ? (
                                                                    <ul className="pl-6 relative">
                                                                        {child.Children.map(
                                                                            childOfChild => (
                                                                                <li
                                                                                    key={
                                                                                        childOfChild.UUID
                                                                                    }
                                                                                    className="mt-2"
                                                                                >
                                                                                    <FontAwesomeIcon
                                                                                        className="absolute mt-1 left-0 text-gray-700"
                                                                                        icon={
                                                                                            faFolder
                                                                                        }
                                                                                    />
                                                                                    <span className="text-sm text-gray-800 mb-4">
                                                                                        {
                                                                                            childOfChild.Titel
                                                                                        }
                                                                                    </span>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : null}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : null}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : null}
                    </div>
                </div>

                {/* Container */}
                {this.state.dataLoaded ? (
                    <div className="w-3/4 inline-block flex-grow pl-8">
                        <div className="bg-white rounded shadow-lg">
                            <div className="p-5 border-b border-gray-400">
                                {this.state.activeHoofdstuk !== null ? (
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Hoofdstuk{' '}
                                        {this.state.activeHoofdstuk + 1} -{' '}
                                        {
                                            this.state.lineage.Structuur
                                                .Children[
                                                this.state.activeHoofdstuk
                                            ].Titel
                                        }
                                    </h2>
                                ) : (
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Omgevingsverordening Zuid-Holland
                                    </h2>
                                )}
                            </div>
                            <div>
                                {this.state.activeHoofdstuk !== null ? (
                                    <div>
                                        <DragAndDropList />
                                    </div>
                                ) : (
                                    <ul className="py-5">
                                        {this.state.lineage.Structuur.Children.map(
                                            (hoofdstuk, index) => (
                                                <li
                                                    onClick={() =>
                                                        this.changeActiveHoofdstuk(
                                                            hoofdstuk.Volgnummer
                                                        )
                                                    }
                                                    className={`px-5 hover:bg-gray-100 py-2 cursor-pointer ${
                                                        index !== 0
                                                            ? 'border-t border-gray-100'
                                                            : ''
                                                    }`}
                                                >
                                                    <h3 className="font-semibold text-gray-800">
                                                        {hoofdstuk.Titel}
                                                    </h3>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <LoaderContent />
                )}
            </ContainerMain>
        )
    }
}

export default withRouter(MuteerVerordeningenstructuurDetail)
