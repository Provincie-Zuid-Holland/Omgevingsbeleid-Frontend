import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

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
    }

    render() {
        // Variables
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud
        const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const hoofdOnderdeelSlug = this.props.dataModel.variables.Overzicht_Slug

        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - {'Beheer ' + titelMeervoud}</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Maatregel Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif text-gray-800 mb-4">
                        Mijn {titelMeervoud}
                    </h2>

                    <ul className="flex mt-8 flex-wrap">
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
                            this.state.objecten.map((object, index) => (
                                <li
                                    key={object.ID}
                                    className="mb-6 w-full display-inline"
                                >
                                    {
                                        <CardObjectDetails
                                            index={index}
                                            object={object}
                                            overzichtSlug={overzichtSlug}
                                            titelEnkelvoud={titelEnkelvoud}
                                            hoofdOnderdeelSlug={overzichtSlug}
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

    componentDidUpdate(prevProps) {
        if (
            this.props.dataModel.variables.Api_Endpoint !==
            prevProps.dataModel.variables.Api_Endpoint
        ) {
            this.getDataFromAPI(this.props.dataModel.variables.Api_Endpoint)
        }
    }

    getDataFromAPI(ApiEndpoint) {
        this.setState(
            {
                objecten: [],
            },
            () => {
                // Connect With the API
                axios
                    .get(ApiEndpoint)
                    .then(res => {
                        let objecten = res.data
                        // objecten.shift()
                        this.setState({
                            objecten: objecten,
                            dataReceived: true,
                        })
                    })
                    .catch(error => {
                        this.setState({
                            dataReceived: true,
                        })
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
        )
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint
        this.getDataFromAPI(ApiEndpoint)
    }
}
export default MuteerUniversalObjectOverzicht
