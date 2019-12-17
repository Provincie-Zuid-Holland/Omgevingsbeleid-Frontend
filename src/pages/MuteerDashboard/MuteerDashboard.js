import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import API
import axios from './../../API/axios'

// Import Components
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import MijnBeleid from './../../components/MijnBeleid'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardKoppeling from './CardKoppeling'
import CardEigenaarOverdracht from './CardEigenaarOverdracht'
import CardAlgemeneMelding from './CardAlgemeneMelding'
import CardObjectDetailsHalfWidth from './../../components/CardObjectDetailsHalfWidth'
import LoaderCardHalfWidth from './../../components/LoaderCardHalfWidth'

class KaartenGroep extends Component {
    render() {
        return (
            <div className="w-full inline-block relative">
                {this.props.children}
            </div>
        )
    }
}

class MuteerDashboard extends Component {
    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Dashboard</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    {/* <section>
                        <h2 className="heading-serif text-gray-800 mb-4">
                            Meldingen
                        </h2>

                        <CardKoppeling />
                    </section> */}
                    <section>
                        <h2 className="heading-serif text-gray-800">
                            Mijn beleid
                        </h2>

                        <MijnBeleid
                            hideToevoegen={true}
                            authUser={this.props.authUser}
                        />

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
            </ContainerMain>
        )
    }
}

export default MuteerDashboard
