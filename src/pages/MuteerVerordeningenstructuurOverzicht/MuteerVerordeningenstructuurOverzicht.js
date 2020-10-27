import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
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
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
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
                            <div
                                className={`mb-6 display-inline mb-6 display-inline w-full`}
                            >
                                <Link
                                    id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                                    className="flex items-center justify-center h-full px-4 py-4 overflow-hidden text-gray-600 no-underline border border-gray-300 border-dashed rounded hover:border-gray-400 transition-regular hover:text-gray-800"
                                    to={`/muteer/nieuwe-verordening`}
                                >
                                    <span className="px-4 py-2 font-semibold text-center">
                                        + Voeg {titelEnkelvoud} Toe
                                    </span>
                                </Link>
                            </div>
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

export default MuteerVerordeningenstructuurOverzicht
