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
            className="w-1/2 inline-block"
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
                <span className="text-sm w-full text-gray-700 p-4 block absolute bottom-0 bg-white z-10">
                    {props.werkingsgebied.Werkingsgebied}
                </span>
            </div>
        </li>
    )
}

function PopUpWerkingsGebiedContent(props) {
    let filteredContent = props.werkingsgebieden
    if (props.filterValue !== '') {
        filteredContent = filteredContent.filter(item =>
            item.Werkingsgebied.toLowerCase().includes(
                props.filterValue.toLowerCase()
            )
        )
    }

    return (
        <React.Fragment>
            <animated.div
                className="fixed w-screen bg-gray-900 h-screen top-0 left-0 z-10"
                style={useSpring({
                    config: { tension: 300 },
                    opacity: 0.25,
                    from: { opacity: 0 },
                })}
            />
            <div className="fixed top-0 left-0 z-10">
                <div className="flex h-screen w-screen top-0 left-0 justify-center items-center p-8">
                    <animated.div
                        style={useSpring({
                            config: { tension: 300 },
                            transform: 'scale(1)',
                            from: { transform: 'scale(0.75)' },
                        })}
                        className="max-w-5xl relative bg-white rounded shadow px-6 py-6 popup-long"
                    >
                        <div
                            onClick={props.togglePopUp}
                            className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
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
                        <div className="w-full block relative mt-4 mb-6">
                            <input
                                className="appearance-none w-full block text-gray-700 border border-gray-400 rounded py-3 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500 shadow text-sm"
                                id={`form-field-werkingsgebied-zoekbalk`}
                                type="text"
                                value={props.filterValue}
                                onChange={props.filterGebieden}
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute right-0 top-0 mr-4 mt-4 text-gray-600 text-sm"
                                icon={faSearch}
                            />
                        </div>
                        <div className="shadow border rounded px-4 py-4">
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
                        <div className="flex justify-between items-center mt-6">
                            <span
                                className="text-gray-600 cursor-pointer text-sm underline"
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
        const handleChangeObject = {
            target: {
                name: 'WerkingsGebieden',
                value: [{ UUID: this.state.selected }],
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
            objectenArray.slice(1).forEach(arrayItem => {
                werkingsgebiedUUIDArray.push(arrayItem.UUID)
            })
            return werkingsgebiedUUIDArray
        }
    }

    returnAxiosRequestArray(UUIDArray) {
        let axiosArray = []
        UUIDArray.forEach(item => {
            axiosArray.push(axios.get('/user/12345/permissions'))
        })
    }

    generateJSONForAllWerkingsgebieden(UUIDArray) {
        let werkingsgebiedenArray = []
        const that = this
        import('./../../API/axiosGeoJSON').then(api => {
            UUIDArray.forEach(item => {
                api.getGeoJsonData('Werkingsgebieden', item)
                    .then(data => {
                        werkingsgebiedenArray.push(data)
                        that.setState({
                            werkingsgebieden: werkingsgebiedenArray,
                        })
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            })
        })
    }

    componentDidMount() {
        axios
            .get('werkingsgebieden')
            .then(res => {
                res.data.shift()
                const werkingsgebieden = res.data
                this.setState({
                    werkingsgebieden: werkingsgebieden,
                    dataLoaded: true,
                })
            })
            .catch(error => {
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

    componentDidMount() {
        if (!this.props.fieldValue || this.props.fieldValue.length === 0) {
            return
        }
        axios
            .get(`/werkingsgebieden/${this.props.fieldValue[0].UUID}`)
            .then(res => {
                const response = res.data
                this.setState({
                    gekoppeldGebied: response,
                })
            })
            .catch(error => {
                console.log(error)
            })
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
            .then(res => {
                const response = res.data
                this.setState({
                    gekoppeldGebied: response,
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className="flex flex-wrap -mx-3 mb-6">
                <div
                    className="w-full px-3"
                    id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                >
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        addObjectLabel={this.props.addObjectLabel}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />

                    {this.state.gekoppeldGebied === null ? (
                        <React.Fragment>
                            <div
                                className="mt-4 cursor-pointer rounded border-dashed border-2 px-3 py-3 text-gray-600 text-sm"
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
            <div className="w-1/2 bg-white p-5 relative">
                <h3 className="font-bold text-gray-700 text-sm py-2">
                    {props.title}
                </h3>
                <span className="text-gray-600 text-xs py-1">
                    Laatst gewijzigd op{' '}
                    {format(props.laatstGewijzigd, 'DD	MMMM YYYY', {
                        locale: nlLocale,
                    })}
                </span>
                <span
                    className="text-red-600 cursor-pointer text-sm underline absolute bottom-0 left-0 ml-5 mb-5"
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
