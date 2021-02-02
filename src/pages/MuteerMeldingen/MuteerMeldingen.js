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
        this.setState({
            objecten: [],
            dataReceived: true,
        })
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
                <div className="relative flex-grow inline-block w-3/4 pl-8 rounded">
                    <section>
                        <h2 className="mt-8 mb-4 text-gray-800 heading-serif">
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
