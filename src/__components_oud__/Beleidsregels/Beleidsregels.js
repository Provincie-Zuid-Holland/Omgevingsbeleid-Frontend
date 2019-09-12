import React, { Component } from 'react'

// Import Componenents
import MainSidebar from './../MainSidebar'
import VoegObjectToe from './../UI/VoegObjectToe'
import CardObjectItem from './../UI/CardObjectItem'
import LoaderCardObject from './../UI/Loaders/LoaderCardObject'

// Import Axios instance to connect with the API
import axiosAPI from './../../API/axios'

class Beleidsregels extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objecten: [],
        }
    }

    render() {
        // Variables
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const hoofdOnderdeelSlug = 'beleidsregels'

        // False if data is loading, true if there is a response
        let dataReceived = this.state.objecten[0]

        return (
            <div className="container mx-auto flex px-6 pb-8">
                {/* Sidebar */}
                <MainSidebar />

                {/* Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif mb-4">Mijn Beleidsregels</h2>

                    <ul className="flex mt-8 flex-wrap">
                        {dataReceived ? (
                            this.state.objecten.slice(1).map(object => (
                                <li
                                    key={object.ID}
                                    className="mb-6 w-full display-inline"
                                >
                                    {
                                        <CardObjectItem
                                            object={object}
                                            overzichtSlug={overzichtSlug}
                                            titelEnkelvoud={titelEnkelvoud}
                                            hoofdOnderdeelSlug={
                                                hoofdOnderdeelSlug
                                            }
                                            hideParagraaf={true}
                                        />
                                    }
                                </li>
                            ))
                        ) : (
                            <React.Fragment>
                                <LoaderCardObject />
                                <LoaderCardObject />
                                <LoaderCardObject />
                            </React.Fragment>
                        )}

                        {dataReceived ? (
                            <VoegObjectToe
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
            </div>
        )
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint

        // Connect With the API
        axiosAPI
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
}

export default Beleidsregels
