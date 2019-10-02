import React, { Component } from 'react'

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
        }
    }

    render() {
        // Variables
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud
        const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const hoofdOnderdeelSlug = 'maatregelen'

        // False if data is loading, true if there is a response
        let dataReceived = this.state.objecten[0]

        return (
            <ContainerMain>
                {/* Sidebar */}
                <SidebarMain />

                {/* Maatregel Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif mb-4">Mijn {titelMeervoud}</h2>

                    <ul className="flex mt-8 flex-wrap">
                        {dataReceived ? (
                            this.state.objecten.slice(1).map(object => (
                                <li
                                    key={object.ID}
                                    className="mb-6 w-full display-inline"
                                >
                                    {
                                        <CardObjectDetails
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

                        {dataReceived ? (
                            <ButtonAddNewObject
                                objectAantal={this.state.objecten.length}
                                titelEnkelvoud={titelEnkelvoud}
                                overzichtSlug={overzichtSlug}
                                createNewSlug={createNewSlug}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                                fullWidth={true}
                            />
                        ) : null}
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
                        const objecten = res.data
                        this.setState({ objecten })
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
        )
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint
        this.getDataFromAPI(ApiEndpoint)
    }
}
export default MuteerUniversalObjectOverzicht
