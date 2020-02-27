import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import LoaderCard from './../../components/LoaderCard'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

class MuteerUniversalObjectOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objecten: [],
            dataReceived: false,
        }
        this.getAndSetDataFromAPI = this.getAndSetDataFromAPI.bind(this)
    }

    getAndSetDataFromAPI(ApiEndpoint) {
        axios
            .get(ApiEndpoint)
            .then(res => {
                let objecten = res.data
                this.setState({
                    objecten: objecten,
                    dataReceived: true,
                })
            })
            .catch(error => {
                this.setState(
                    {
                        dataReceived: true,
                    },
                    () =>
                        toast(
                            'Er ging iets mis met het verbinden met de server. Probeer het later opnieuw.'
                        )
                )
            })
    }

    componentDidMount() {
        const apiEndpoint = this.props.dimensieConstants.API_ENDPOINT
        this.getAndSetDataFromAPI(apiEndpoint)
    }

    render() {
        // Set variabelen vanuit het meegekregen dimensie constant object
        const dimensieConstants = this.props.dimensieConstants

        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
        const titelMeervoud = dimensieConstants.TITEL_MEERVOUD
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT
        const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
        const hoofdOnderdeelSlug = dimensieConstants.SLUG_OVERZICHT

        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - {'Beheer ' + titelMeervoud}</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif text-gray-800 mb-4">
                        {titelMeervoud}
                    </h2>

                    {this.state.dataReceived ? (
                        <ul className="flex mt-8 flex-wrap">
                            <ButtonAddNewObject
                                objectAantal={this.state.objecten.length}
                                titelEnkelvoud={titelEnkelvoud}
                                overzichtSlug={overzichtSlug}
                                createNewSlug={createNewSlug}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                                fullWidth={true}
                            />

                            {this.state.objecten
                                .sort((a, b) => (a.Titel > b.Titel ? 1 : -1))
                                .map((object, index) => (
                                    <li
                                        key={object.ID}
                                        className="mb-6 w-full display-inline"
                                    >
                                        <CardObjectDetails
                                            index={index}
                                            object={object}
                                            overzichtSlug={overzichtSlug}
                                            titelEnkelvoud={titelEnkelvoud}
                                            hoofdOnderdeelSlug={overzichtSlug}
                                            hideParagraaf={true}
                                        />
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <React.Fragment>
                            <LoaderCard />
                            <LoaderCard />
                            <LoaderCard />
                        </React.Fragment>
                    )}
                </div>
            </ContainerMain>
        )
    }
}
export default MuteerUniversalObjectOverzicht
