import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import LoaderCard from './../../components/LoaderCard'
import MeldingAlgemeen from './../../components/MeldingAlgemeen'
import MeldingEigenaarOverdracht from './../../components/MeldingEigenaarOverdracht'
import MeldingKoppeling from './../../components/MeldingKoppeling'

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
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Meldingen</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <section>
                        <h2 className="heading-serif text-gray-800 mb-4 mt-8">
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
                            <div className="w-full">
                                <LoaderCard />
                                <LoaderCard />
                            </div>
                        )}
                    </section>
                </div>
            </ContainerMain>
        )
    }
}

export default MuteerMeldingen
