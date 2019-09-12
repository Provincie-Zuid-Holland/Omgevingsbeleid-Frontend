import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    faCheckCircle,
    faPlus,
    faTimes,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSpring, animated } from 'react-spring'

import axios from './../../API/axios'
import { api_version, axiosGeoJSON } from './../../API/axiosGeoJSON'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 1) {
        return null
    } else {
        let options = []
        objectenArray.slice(1).forEach(arrayItem => {
            options.push({
                label: arrayItem.Werkingsgebied,
                value: arrayItem.UUID,
                target: {
                    type: 'relatie',
                    value: arrayItem.UUID,
                    name: dataObjectProperty,
                },
            })
        })
        return options
    }
}

function CardWerkingsGebied() {
    return (
        <li className="w-1/3 inline-block">
            <div className="mx-4 my-4 hover:border-green-500 border-2 cursor-pointer text-center rounded">
                <div className="block w-full h-48 bg-orange-300 rounded-t" />
                <span className="text-sm text-gray-700 py-4 block">
                    Bedrijventerrein
                </span>
            </div>
        </li>
    )
}

function PopUpWerkingsGebiedContent(props) {
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
                <div className="flex h-screen w-screen top-0 left-0 justify-center items-center">
                    <animated.div
                        style={useSpring({
                            config: { tension: 300 },
                            transform: 'scale(1)',
                            from: { transform: 'scale(0.75)' },
                        })}
                        className="max-w-5xl relative bg-white rounded shadow px-6 py-6"
                    >
                        <div
                            onClick={props.togglePopUp}
                            className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
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
                                id="titel"
                                type="text"
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute right-0 top-0 mr-4 mt-4 text-gray-600 text-sm"
                                icon={faSearch}
                            />
                        </div>
                        <div className="shadow border rounded px-4 py-4">
                            <ul className="flex-row overflow-y-auto max-h-half-screen">
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                                <CardWerkingsGebied />
                            </ul>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <span className="text-gray-600 cursor-pointer text-sm underline">
                                Annuleren
                            </span>
                            <div className="font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-green-600 text-white hover:underline">
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
        }
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
    generateWerkingsgebiedenUUIDArray() {
        axios
            .get('werkingsgebieden')
            .then(res => {
                const objecten = res.data
                const selectionArray = this.makeSelection(objecten)
                return this.generateJSONForAllWerkingsgebieden(selectionArray)
            })
            .catch(error => {
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('access_token')
                        this.props.history.push('/login')
                    }
                } else {
                    console.log(error)
                }
            })
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
                        that.setState(
                            {
                                werkingsgebieden: werkingsgebiedenArray,
                            },
                            () => console.log(that.state)
                        )
                    })
                    .catch(function(thrown) {
                        console.log(thrown)
                    })
            })
        })

        // axios
        //     .get('werkingsgebieden')
        //     .then(res => {
        //         const objecten = res.data
        //         const selectionArray = this.makeSelection(objecten)
        //         return selectionArray
        //     })
        //     .catch(error => {
        //         if (error.response !== undefined) {
        //             if (error.response.status === 401) {
        //                 localStorage.removeItem('access_token')
        //                 this.props.history.push('/login')
        //             }
        //         } else {
        //             console.log(error)
        //         }
        //     })
    }

    componentDidMount() {
        const werkingsgebieden = this.generateWerkingsgebiedenUUIDArray()
        console.log(werkingsgebieden)
    }
    render() {
        return (
            <PopUpWerkingsGebiedContent
                werkingsgebieden={this.state.werkingsgebieden}
                togglePopUp={this.props.togglePopUp}
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
        }
        this.togglePopUp = this.togglePopUp.bind(this)
    }

    togglePopUp() {
        this.setState({
            popUpOpen: !this.state.popUpOpen,
        })
    }

    render() {
        return (
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        hideObjectLabel={this.props.hideObjectLabel}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />
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
                            togglePopUp={this.togglePopUp}
                        />
                    ) : null}
                </div>
            </div>
        )
    }
}

FormFieldWerkingsgebiedKoppeling.propTypes = {}

FormFieldWerkingsgebiedKoppeling.defaultProps = {}

export default FormFieldWerkingsgebiedKoppeling
