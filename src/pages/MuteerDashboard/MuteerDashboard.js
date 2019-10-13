import React, { Component } from 'react'

// Import API
import axios from './../../API/axios'

// Import Components
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
            <div className="container mx-auto flex px-6 pb-8">
                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <section>
                        <h2 className="heading-serif mb-4">Meldingen</h2>

                        <CardKoppeling />
                    </section>
                    <section>
                        <h2 className="heading-serif mb-4 mt-8">Mijn beleid</h2>

                        <MijnBeleid authUser={this.props.authUser} />

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

export default MuteerDashboard
