import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import API
import axios from './../../API/axios'

// Import Components
import SidebarMain from './../../components/SidebarMain'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import LoaderCard from './../../components/LoaderCard'
import MeldingAlgemeen from './../../components/MeldingAlgemeen'
import MeldingEigenaarOverdracht from './../../components/MeldingEigenaarOverdracht'
import MeldingKoppeling from './../../components/MeldingKoppeling'

class KaartenGroep extends Component {
    render() {
        return (
            <div className="w-full inline-block relative">
                {this.props.children}
            </div>
        )
    }
}

class MuteerMeldingen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objecten: [],
            dataReceived: false,
        }
    }

    componentDidMount() {
        this.setState(
            {
                objecten: [],
                dataReceived: true,
            },
            () => {
                // // Connect With the API
                // axios
                //     .get('/api_endpoint_voor_beleidsbeslissingen')
                //     .then(res => {
                //         const objecten = res.data
                //         this.setState({
                //             objecten: objecten,
                //             dataReceived: true,
                //         })
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
        )
    }

    render() {
        // // Variables
        // const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        // const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud
        // const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        // const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        // const hoofdOnderdeelSlug = this.props.dataModel.variables.Overzicht_Slug

        return (
            <div className="container mx-auto flex px-6 pb-8">
                <Helmet>
                    <title>Omgevingsbeleid - Meldingen</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <section>
                        <h2 className="heading-serif mb-4 mt-8">
                            Mijn Meldingen
                        </h2>

                        {this.state.dataReceived ? (
                            <React.Fragment>
                                <MeldingAlgemeen
                                    buttonText="Markeer als gelezen"
                                    titel="Reprehenderit esse duis"
                                    icon="faExclamationTriangle"
                                >
                                    Nulla amet laborum cupidatat ex. Officia eu
                                    consequat minim enim aliqua ad ea cillum qui
                                    magna ipsum. In non minim anim quis ipsum
                                    esse ullamco nulla exercitation esse
                                    laborum. Qui commodo dolor dolore dolore
                                    adipisicing minim fugiat voluptate
                                    consectetur exercitation ullamco. Id nostrud
                                    adipisicing exercitation proident.
                                </MeldingAlgemeen>
                                <MeldingEigenaarOverdracht />
                                <MeldingKoppeling />
                            </React.Fragment>
                        ) : (
                            // <ul className="flex mt-8 flex-wrap">
                            //     {this.state.objecten.slice(1).map(object => (
                            //         <li
                            //             key={object.ID}
                            //             className="mb-6 w-full display-inline"
                            //         >
                            //             {
                            //                 // <CardObjectDetailsHalfWidth
                            //                 //     object={object}
                            //                 //     overzichtSlug={overzichtSlug}
                            //                 //     titelEnkelvoud={titelEnkelvoud}
                            //                 //     hoofdOnderdeelSlug={
                            //                 //         overzichtSlug
                            //                 //     }
                            //                 //     hideParagraaf={true}
                            //                 // />
                            //             }
                            //         </li>
                            //     ))}
                            // </ul>
                            <div className="w-full">
                                <LoaderCard />
                                <LoaderCard />
                            </div>
                        )}

                        {/* {this.state.dataReceived ? (
                                <ButtonAddNewObject
                                    objectAantal={this.state.objecten.length}
                                    titelEnkelvoud={titelEnkelvoud}
                                    overzichtSlug={overzichtSlug}
                                    createNewSlug={createNewSlug}
                                    hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                                    fullWidth={true}
                                />
                            ) : null} */}
                    </section>
                </div>
            </div>
        )
    }
}

export default MuteerMeldingen
