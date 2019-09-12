import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Import Components
import SidebarMain from './../../components/SidebarMain'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetail from './../../components/CardObjectDetails'
import ContainerAnimateContent from './../../components/ContainerAnimateContent'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

class MuteerApiTestOverzicht extends Component {
    state = {
        objecten: [],
    }

    render() {
        // Variables
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud
        const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const hoofdOnderdeelSlug = this.props.hoofdOnderdeelSlug

        // Wordt gebruikt om de URLS te bepalen
        const apiTest = true

        // False if data is loading, true if there is a response
        let dataReceived = this.state.objecten[0]

        return (
            <div className="container mx-auto flex px-6 pb-8">
                {/* Sidebar */}
                <SidebarMain />

                {/* Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <ButtonBackToPage
                        terugNaar="API Test Omgeving"
                        url={`/${hoofdOnderdeelSlug}/`}
                    />

                    <div className="flex justify-between">
                        <h1 className="heading-serif-2xl">
                            Alle{' '}
                            {dataReceived
                                ? this.state.objecten.length - 1
                                : '0'}{' '}
                            {titelMeervoud}
                        </h1>
                        <div>
                            <Link
                                to={`/${hoofdOnderdeelSlug}/${overzichtSlug}/${createNewSlug}`}
                                className="font-bold py-2 px-4 text-sm rounded bg-green-200 text-green-700"
                            >
                                + Voeg {titelEnkelvoud} Toe
                            </Link>
                        </div>
                    </div>

                    <ul className="flex mt-8 flex-wrap" id="API-list">
                        {dataReceived
                            ? this.state.objecten.slice(1).map(object => (
                                  <li
                                      key={object.ID}
                                      className="mb-6 w-1/2 display-inline"
                                  >
                                      <ContainerAnimateContent>
                                          <CardObjectDetail
                                              object={object}
                                              overzichtSlug={overzichtSlug}
                                              titelEnkelvoud={titelEnkelvoud}
                                              hoofdOnderdeelSlug={
                                                  hoofdOnderdeelSlug
                                              }
                                              apiTest={apiTest}
                                          />
                                      </ContainerAnimateContent>
                                  </li>
                              ))
                            : 'Loading...'}

                        {dataReceived ? (
                            <ButtonAddNewObject
                                objectAantal={this.state.objecten.length}
                                titelEnkelvoud={titelEnkelvoud}
                                overzichtSlug={overzichtSlug}
                                createNewSlug={createNewSlug}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                                apiTest={apiTest}
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
}

export default MuteerApiTestOverzicht
