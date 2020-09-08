import React, { Component } from 'react'
import { toast } from 'react-toastify'

// Import API
import axios from './../../API/axios'

// Import Datamodel
import dataModel from './../../App/dataModel'

// Import Componenten
import LoaderCardHalfWidth from './../../components/LoaderCardHalfWidth'
import CardObjectDetailsHalfWidth from './../../components/CardObjectDetailsHalfWidth'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'

class MijnBeleid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataReceived: false,
            objecten: [],
            authUser: null,
        }
    }

    getBeleidVanGebruiker() {
        const dimensies = [
            'Ambities',
            'Opgaven',
            'BeleidsRegels',
            'Doelen',
            'Belangen',
            'Beleidsbeslissingen',
            'Maatregelen',
            "Thema's",
            'Verordeningen',
        ]
        const lijstMetAPIEndpoints = dimensies.map((item) => {
            return {
                endpoint: dataModel[item].variables.Api_Endpoint,
                type: item,
            }
        })
        const axiosRequests = lijstMetAPIEndpoints.map((dimensie) => {
            const authUserUUID = this.state.authUser
            return axios
                .get(
                    dimensie.endpoint === 'beleidsbeslissingen'
                        ? `/${dimensie.endpoint}?Created_By=${authUserUUID}&Eigenaar_1=${authUserUUID}&Eigenaar_2=${authUserUUID}&Opdrachtgever=${authUserUUID}`
                        : `/${dimensie.endpoint}?Created_By=${authUserUUID}`
                )
                .then((res) => {
                    if (res.data.length === 0) {
                        return
                    } else {
                        const newArray = res.data.map((array, index) => {
                            return {
                                type: dimensie.type,
                                object: array,
                            }
                        })
                        return newArray
                    }
                })
        })
        Promise.all(axiosRequests)
            .then((res) => {
                this.setState({
                    objecten: res,
                    dataReceived: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    componentDidMount() {
        this.setState(
            {
                authUser: JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_KEY_IDENTIFIER)
                ).UUID.toUpperCase(),
            },
            () => this.getBeleidVanGebruiker()
        )
    }

    render() {
        return (
            <div className="MijnBeleid">
                {this.state.dataReceived ? (
                    <React.Fragment>
                        {!this.props.hideToevoegen ? (
                            <div className="flex">
                                <div className="w-full mr-6">
                                    <ButtonAddNewObject
                                        titelEnkelvoud={'Beleidskeuze'}
                                        createNewSlug={
                                            'nieuwe-beleidskeuze#mijn-beleid'
                                        }
                                        hoofdOnderdeelSlug={'beleidskeuzes'}
                                        fullWidth={true}
                                    />
                                </div>
                                <ButtonAddNewObject
                                    titelEnkelvoud={'Maatregel'}
                                    createNewSlug={
                                        'nieuwe-maatregel#mijn-beleid'
                                    }
                                    hoofdOnderdeelSlug={'maatregelen'}
                                    fullWidth={true}
                                />
                            </div>
                        ) : null}
                        <ul className="flex flex-wrap mt-5">
                            {this.state.objecten.length > 0 &&
                            !this.state.objecten.every(
                                (x) => x === undefined
                            ) ? (
                                this.state.objecten.map((array) => {
                                    if (!array) {
                                        return null
                                    }
                                    const items = array.map((item, index) => {
                                        const type = item.type
                                        const overzichtSlug =
                                            dataModel[type].variables
                                                .Overzicht_Slug
                                        const titelEnkelvoud =
                                            dataModel[type].variables
                                                .Titel_Enkelvoud

                                        return (
                                            <li
                                                key={item.object.UUID}
                                                className={`mb-6 w-1/2 display-inline odd-pr-3 even-pl-3`}
                                            >
                                                {
                                                    <CardObjectDetailsHalfWidth
                                                        fullWidth={true}
                                                        index={index}
                                                        mijnBeleid={true}
                                                        object={item.object}
                                                        titelEnkelvoud={
                                                            titelEnkelvoud
                                                        }
                                                        hideParagraaf={true}
                                                        overzichtSlug={
                                                            overzichtSlug
                                                        }
                                                    />
                                                }
                                            </li>
                                        )
                                    })

                                    return items
                                })
                            ) : (
                                <span className="mb-4 text-gray-600 font-italic">
                                    U heeft nog geen beleid
                                </span>
                            )}
                        </ul>
                    </React.Fragment>
                ) : (
                    <div className="mt-8">
                        <div className="flex flex-row w-full">
                            <LoaderCardHalfWidth mr={true} />
                            <LoaderCardHalfWidth />
                        </div>
                        <div className="flex flex-row w-full">
                            <LoaderCardHalfWidth mr={true} />
                            <LoaderCardHalfWidth />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

MijnBeleid.propTypes = {}

MijnBeleid.defaultProps = {}

export default MijnBeleid
