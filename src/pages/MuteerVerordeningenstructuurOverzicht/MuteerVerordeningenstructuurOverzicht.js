import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import LoaderCard from './../../components/LoaderCard'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

class MuteerVerordeningenstructuurOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataReceived: false,
            objecten: [],
        }
    }

    getDataFromAPI(ApiEndpoint) {
        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then((res) => {
                let objecten = res.data

                this.setState({
                    objecten: objecten,
                    dataReceived: true,
                })
            })
            .catch((error) => {
                this.setState({
                    dataReceived: true,
                })
            })
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.API_ENDPOINT
        this.getDataFromAPI(ApiEndpoint)
    }

    render() {
        const titelEnkelvoud = this.props.dataModel.TITEL_ENKELVOUD
        const titelMeervoud = this.props.dataModel.TITEL_MEERVOUD
        const createNewSlug = this.props.dataModel.SLUG_CREATE_NEW
        const overzichtSlug = this.props.dataModel.SLUG_OVERZICHT
        const hoofdOnderdeelSlug = this.props.dataModel.SLUG_OVERZICHT

        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - {'Beheer ' + titelMeervoud}</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Container */}
                <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                    <h2 className="mb-4 text-gray-800 heading-serif">
                        {titelMeervoud}
                    </h2>

                    <ul className="flex flex-wrap mt-8">
                        {this.state.dataReceived ? (
                            <ButtonAddNewObject
                                objectAantal={this.state.objecten.length}
                                titelEnkelvoud={titelEnkelvoud}
                                overzichtSlug={overzichtSlug}
                                createNewSlug={createNewSlug}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                                fullWidth={true}
                            />
                        ) : null}
                        {this.state.dataReceived ? (
                            this.state.objecten
                                .sort((a, b) => (a.Titel > b.Titel ? 1 : -1))
                                .map((object, index) => (
                                    <li
                                        key={object.ID}
                                        className="w-full mb-6 display-inline"
                                    >
                                        {
                                            <CardObjectDetails
                                                index={index}
                                                object={object}
                                                overzichtSlug={overzichtSlug}
                                                titelEnkelvoud={titelEnkelvoud}
                                                hoofdOnderdeelSlug={
                                                    overzichtSlug
                                                }
                                                hideParagraaf={true}
                                            />
                                        }
                                    </li>
                                ))
                        ) : (
                            <React.Fragment>
                                <LoaderCard />
                                <LoaderCard />
                                <LoaderCard />
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            </ContainerMain>
        )
    }
}

MuteerVerordeningenstructuurOverzicht.propTypes = {}

MuteerVerordeningenstructuurOverzicht.defaultProps = {}

export default MuteerVerordeningenstructuurOverzicht
