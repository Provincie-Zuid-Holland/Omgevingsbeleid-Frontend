import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Import API
import axios from './../../API/axios'

// Import Datamodel
import dataModel from './../../App/dataModel'

// Import Componenten
import LoaderCardHalfWidth from './../../components/LoaderCardHalfWidth'
import CardObjectDetailsHalfWidth from './../../components/CardObjectDetailsHalfWidth'

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
        console.log('Called')
        const dimensies = [
            'Ambitie',
            'Opgave',
            'BeleidsRegel',
            'Doel',
            'Belang',
            // 'BeleidsRelatie',
            'Beleidsbeslissingen',
            'Maatregelen',
            'Thema',
            'Verordening',
        ]
        const lijstMetAPIEndpoints = dimensies.map(item => {
            return {
                endpoint: dataModel[item].variables.Api_Endpoint,
                type: item,
            }
        })

        console.log(lijstMetAPIEndpoints)

        const axiosRequests = lijstMetAPIEndpoints.map(dimensie =>
            axios
                .get(`/${dimensie.endpoint}?Created_By=${this.state.authUser}`)
                .then(res => {
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
        )
        Promise.all(axiosRequests)
            .then(res => {
                console.log('Received All')
                this.setState(
                    {
                        objecten: res,
                        dataReceived: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        this.setState(
            {
                authUser: JSON.parse(localStorage.getItem('identifier')).UUID,
            },
            () => this.getBeleidVanGebruiker()
        )
    }

    render() {
        return (
            <div className="MijnBeleid">
                {this.state.dataReceived ? (
                    <ul className="flex mt-8 flex-wrap">
                        {this.state.objecten.slice(1).map(array => {
                            if (!array) {
                                return
                            }
                            const items = array.map((item, index) => {
                                const type = item.type
                                const overzichtSlug =
                                    dataModel[type].variables.Overzicht_Slug
                                const titelEnkelvoud =
                                    dataModel[type].variables.Titel_Enkelvoud

                                return (
                                    <li
                                        key={item.object.UUID}
                                        className={`mb-6 w-1/2 display-inline odd-pr-6`}
                                    >
                                        {
                                            <CardObjectDetailsHalfWidth
                                                fullWidth={true}
                                                index={index}
                                                object={item.object}
                                                titelEnkelvoud={titelEnkelvoud}
                                                hideParagraaf={true}
                                                overzichtSlug={overzichtSlug}
                                            />
                                        }
                                    </li>
                                )
                            })

                            return items
                        })}
                    </ul>
                ) : (
                    <React.Fragment>
                        <div className="flex flex-row w-full">
                            <LoaderCardHalfWidth mr={true} />
                            <LoaderCardHalfWidth />
                        </div>
                        <div className="flex flex-row w-full">
                            <LoaderCardHalfWidth mr={true} />
                            <LoaderCardHalfWidth />
                        </div>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

MijnBeleid.propTypes = {}

MijnBeleid.defaultProps = {}

export default MijnBeleid
