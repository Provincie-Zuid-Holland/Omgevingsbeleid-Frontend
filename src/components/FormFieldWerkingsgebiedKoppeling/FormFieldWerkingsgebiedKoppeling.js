import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { faPlus, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSpring, animated } from 'react-spring'
import format from 'date-fns/format'
import nlLocale from 'date-fns/locale/nl'

import axios from './../../API/axios'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'
import LoaderWerkingsgebiedCard from './../LoaderWerkingsgebiedCard'
import LeafletCardViewer from './../LeafletCardViewer'

function CardWerkingsGebied(props) {
    return (
        <li
            className="inline-block w-1/2"
            key={props.werkingsgebied.UUID}
            id={`form-field-werkingsgebied-${props.index}`}
            onClick={() => {
                props.selectGebied(props.werkingsgebied.UUID)
            }}
        >
            <div
                className={`mx-4 my-4 hover:border-green-500 border-2 cursor-pointer text-left relative h-64 bg-orange-300 rounded ${
                    props.selected === props.werkingsgebied.UUID
                        ? 'border-green-500'
                        : ''
                }`}
            >
                <span className="absolute bottom-0 z-10 block w-full p-4 text-sm text-gray-700 bg-white">
                    {props.werkingsgebied.Werkingsgebied}
                </span>
            </div>
        </li>
    )
}

function PopUpWerkingsGebiedContent(props) {
    let filteredContent = props.werkingsgebieden
    if (props.filterValue !== '') {
        filteredContent = filteredContent.filter((item) =>
            item.Werkingsgebied.toLowerCase().includes(
                props.filterValue.toLowerCase()
            )
        )
    }

    return (
        <React.Fragment>
            <animated.div
                className="fixed top-0 left-0 z-10 w-screen h-screen bg-gray-900"
                style={useSpring({
                    config: { tension: 300 },
                    opacity: 0.25,
                    from: { opacity: 0 },
                })}
            />
            <div className="fixed top-0 left-0 z-10">
                <div className="top-0 left-0 flex items-center justify-center w-screen h-screen p-8">
                    <animated.div
                        style={useSpring({
                            config: { tension: 300 },
                            transform: 'scale(1)',
                            from: { transform: 'scale(0.75)' },
                        })}
                        className="relative max-w-5xl px-6 py-6 bg-white rounded shadow popup-long"
                    >
                        <div
                            onClick={props.togglePopUp}
                            className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                            id={`form-field-werkingsgebied-popup-sluiten`}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                        <h3 className="form-field-label">
                            Werkingsgebied koppelen
                        </h3>
                        <p className="form-field-description">
                            Selecteer het werkingsgebied wat je wilt koppelen
                        </p>
                        <div className="relative block w-full mt-4 mb-6">
                            <input
                                className="block w-full py-3 pl-4 pr-12 text-sm leading-tight text-gray-700 border border-gray-400 rounded shadow appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                                id={`form-field-werkingsgebied-zoekbalk`}
                                type="text"
                                value={props.filterValue}
                                onChange={props.filterGebieden}
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-600"
                                icon={faSearch}
                            />
                        </div>
                        <div className="px-4 py-4 border rounded shadow">
                            <ul className="flex-row overflow-y-auto max-h-half-screen">
                                {props.dataLoaded ? (
                                    filteredContent.map((item, index) => {
                                        return (
                                            <CardWerkingsGebied
                                                index={index}
                                                selectGebied={
                                                    props.selectGebied
                                                }
                                                selected={props.selected}
                                                key={item.UUID}
                                                werkingsgebied={item}
                                            />
                                        )
                                    })
                                ) : (
                                    <React.Fragment>
                                        <div className="flex-row">
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                            <LoaderWerkingsgebiedCard />
                                        </div>
                                    </React.Fragment>
                                )}
                            </ul>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <span
                                className="text-sm text-gray-600 underline cursor-pointer"
                                onClick={props.togglePopUp}
                                id={`form-field-werkingsgebied-annuleren`}
                            >
                                Annuleren
                            </span>
                            <div
                                className={`font-bold py-2 px-4 leading-tight text-sm rounded bg-green-600 text-white ${
                                    props.selected === null
                                        ? `opacity-50 cursor-not-allowed`
                                        : `hover:underline cursor-pointer`
                                }`}
                                onClick={() => {
                                    if (props.selected === null) {
                                        return
                                    }
                                    props.koppelGebied()
                                    props.togglePopUp()
                                }}
                                id={`form-field-werkingsgebied-koppelen`}
                            >
                                Koppelen
                            </div>
                        </div>
                    </animated.div>
                </div>
            </div>
        </React.Fragment>
    )
}

class PopUpWerkingsGebiedContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            werkingsgebieden: [],
            dataLoaded: false,
            selected: null,
            filterValue: '',
        }
        this.selectGebied = this.selectGebied.bind(this)
        this.koppelGebied = this.koppelGebied.bind(this)
        this.filterGebieden = this.filterGebieden.bind(this)
    }

    filterGebieden(e) {
        this.setState({
            filterValue: e.target.value,
        })
    }

    selectGebied(gebied) {
        this.setState({
            selected: gebied,
        })
    }

    koppelGebied() {
        let value

        if (this.props.dataObjectProperty === 'WerkingsGebieden') {
            // WerkingsGebieden property verwacht een array
            // Wordt gebruikt in Beleidsbeslissingen
            value = [{ UUID: this.state.selected }]
        } else if (this.props.dataObjectProperty === 'Werkingsgebied') {
            // Werkingsgebied property verwacht een enkele UUID
            value = this.state.selected
        }
        const handleChangeObject = {
            target: {
                name: this.props.dataObjectProperty,
                value: value,
            },
        }
        this.props.koppelGebiedInLocalState(this.state.selected)
        this.props.handleChange(handleChangeObject)
    }

    makeSelection(objectenArray) {
        if (objectenArray.length === 1) {
            return null
        } else {
            let werkingsgebiedUUIDArray = []
            objectenArray.slice(1).forEach((arrayItem) => {
                werkingsgebiedUUIDArray.push(arrayItem.UUID)
            })
            return werkingsgebiedUUIDArray
        }
    }

    returnAxiosRequestArray(UUIDArray) {
        let axiosArray = []
        UUIDArray.forEach((item) => {
            axiosArray.push(axios.get('/user/12345/permissions'))
        })
    }

    generateJSONForAllWerkingsgebieden(UUIDArray) {
        let werkingsgebiedenArray = []
        const that = this
        import('./../../API/axiosGeoJSON').then((api) => {
            UUIDArray.forEach((item) => {
                api.getGeoJsonData('Werkingsgebieden', item)
                    .then((data) => {
                        werkingsgebiedenArray.push(data)
                        that.setState({
                            werkingsgebieden: werkingsgebiedenArray,
                        })
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            })
        })
    }

    componentDidMount() {
        axios
            .get('werkingsgebieden')
            .then((res) => {
                res.data.shift()
                const werkingsgebieden = res.data
                this.setState({
                    werkingsgebieden: werkingsgebieden,
                    dataLoaded: true,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    render() {
        return (
            <PopUpWerkingsGebiedContent
                koppelGebied={this.koppelGebied}
                selectGebied={this.selectGebied}
                dataLoaded={this.state.dataLoaded}
                werkingsgebieden={this.state.werkingsgebieden}
                togglePopUp={this.props.togglePopUp}
                selected={this.state.selected}
                filterGebieden={this.filterGebieden}
                filterValue={this.state.filterValue}
            />
        )
    }
}

// !REFACTOR!
// [ ] Herschrijven in functies
// [ ] Waar nodig losse componenten in aparte files neerzetten
// [x] http://localhost:3000/muteer/beleidsbeslissingen/edit/396 geeft een Error bij het ophalen van het werkingsgebied. Er wordt een object als variabele in de URL ge-GET

class FormFieldWerkingsgebiedKoppeling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            werkingsgebieden: [],
            popUpOpen: false,
            gekoppeldGebied: null,
        }
        this.togglePopUp = this.togglePopUp.bind(this)
        this.koppelGebiedInLocalState = this.koppelGebiedInLocalState.bind(this)
        this.ontkoppelWerkingsgebied = this.ontkoppelWerkingsgebied.bind(this)
    }

    getUUIDFromFieldValue(fieldValue, dataObjectProperty) {
        if (dataObjectProperty === 'WerkingsGebieden') {
            // In Beleidsbeslissingen wordt gebruikt gemaakt van een array
            return this.props.fieldValue[0].UUID
        } else {
            // In de andere dimensies wordt gebruik gemaakt van een enkel UUID value
            return this.props.fieldValue
        }
    }

    noUUIDGivenAsProp(fieldValue) {
        if (!fieldValue || fieldValue.length === 0) {
            return true
        } else {
            return false
        }
    }

    initializeWerkingsgebied(UUID) {
        axios
            .get(`/werkingsgebieden/${UUID}`)
            .then((res) => {
                const response = res.data
                this.setState({
                    gekoppeldGebied: response,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidMount() {
        if (this.noUUIDGivenAsProp(this.props.fieldValue)) return

        const UUID = this.getUUIDFromFieldValue(
            this.props.fieldValue,
            this.props.dataObjectProperty
        )
        this.initializeWerkingsgebied(UUID)
    }

    togglePopUp() {
        this.setState({
            popUpOpen: !this.state.popUpOpen,
        })
    }

    ontkoppelWerkingsgebied() {
        this.setState(
            {
                gekoppeldGebied: null,
            },
            () => {
                const handleChangeObject = {
                    target: {
                        name: 'WerkingsGebieden',
                        value: [],
                    },
                }
                this.props.handleChange(handleChangeObject)
            }
        )
    }

    koppelGebiedInLocalState(UUID) {
        // Connect With the API
        axios
            .get(`/werkingsgebieden/${UUID}`)
            .then((res) => {
                const response = res.data
                this.setState({
                    gekoppeldGebied: response,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className="flex flex-wrap mb-6 -mx-3">
                <div
                    className="w-full px-3"
                    id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                >
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />

                    {this.state.gekoppeldGebied === null ? (
                        <React.Fragment>
                            <div
                                className="px-3 py-3 mt-4 text-sm text-gray-600 border-2 border-dashed rounded cursor-pointer"
                                onClick={this.togglePopUp}
                            >
                                <FontAwesomeIcon
                                    className="mr-2 text-gray-600"
                                    icon={faPlus}
                                />
                                Werkingsgebied koppelen
                            </div>
                            {this.state.popUpOpen ? (
                                <PopUpWerkingsGebiedContainer
                                    dataObjectProperty={
                                        this.props.dataObjectProperty
                                    }
                                    handleChange={this.props.handleChange}
                                    togglePopUp={this.togglePopUp}
                                    koppelGebiedInLocalState={
                                        this.koppelGebiedInLocalState
                                    }
                                />
                            ) : null}
                        </React.Fragment>
                    ) : (
                        <GekoppeldGebiedCard
                            title={this.state.gekoppeldGebied.Werkingsgebied}
                            laatstGewijzigd={
                                this.state.gekoppeldGebied.Modified_Date
                            }
                            ontkoppelWerkingsgebied={
                                this.ontkoppelWerkingsgebied
                            }
                            gebiedUUID={this.state.gekoppeldGebied.UUID}
                        />
                    )}
                </div>
            </div>
        )
    }
}

function GekoppeldGebiedCard(props) {
    return (
        <animated.div
            style={useSpring({
                config: { tension: 300 },
                transform: 'scale(1)',
                opacity: '1',
                from: { transform: 'scale(0.9)', opacity: '0.5' },
            })}
            className="flex rounded shadow"
        >
            <div className="relative w-1/2 p-5 bg-white">
                <h3 className="py-2 text-sm font-bold text-gray-700">
                    {props.title}
                </h3>
                <span className="py-1 text-xs text-gray-600">
                    Laatst gewijzigd op{' '}
                    {format(new Date(props.laatstGewijzigd), 'dd	MMMM yyyy', {
                        locale: nlLocale,
                    })}
                </span>
                <span
                    className="absolute bottom-0 left-0 mb-5 ml-5 text-sm text-red-600 underline cursor-pointer"
                    onClick={props.ontkoppelWerkingsgebied}
                    id={`form-field-werkingsgebied-ontkoppelen`}
                >
                    Dit werkingsgebied ontkoppelen
                </span>
            </div>
            <div className="w-1/2 h-64">
                <LeafletCardViewer
                    gebiedType="Werkingsgebieden"
                    gebiedUUID={props.gebiedUUID}
                    fullscreen={false}
                />
            </div>
        </animated.div>
    )
}

export default withRouter(FormFieldWerkingsgebiedKoppeling)
