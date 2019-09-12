import React, { Component } from 'react'

// Import Components
import SidebarMain from './../../components/SidebarMain'
import CardKoppeling from './CardKoppeling'
import CardEigenaarOverdracht from './CardEigenaarOverdracht'
import CardAlgemeneMelding from './CardAlgemeneMelding'

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
                    <h2 className="heading-serif mb-4">Aandachtspunten (x)</h2>

                    <KaartenGroep groepsNaam="Integraal">
                        <CardKoppeling />
                        <CardEigenaarOverdracht />
                    </KaartenGroep>

                    <KaartenGroep groepsNaam="Meedenkend">
                        <CardAlgemeneMelding
                            icon="faUserMinus"
                            titel="Nakijken eigenaarschap"
                            buttonText="Ga naar beleidsbeslissing"
                        >
                            <p className="paragraph mb-6">
                                De beleidsbeslissing
                                <span className="font-bold mx-1">
                                    Duurzame groei van het toerisme in
                                    Zuid-Holland
                                </span>
                                heeft
                                <span className="font-bold mx-1">John Doe</span>
                                als Eigenaar 1. Uit de gegevens blijkt dat zijn
                                dienst vanaf 01-01-2020 eindigt. Zorg dat je op
                                tijd het eigenaarschap overdraagt.
                            </p>
                        </CardAlgemeneMelding>
                    </KaartenGroep>

                    <KaartenGroep groepsNaam="Controlerend">
                        <CardAlgemeneMelding
                            icon="faUnlink"
                            titel="Niet gekoppeld object"
                            buttonText="Ga naar beleidsbeslissing"
                        >
                            <p className="paragraph mb-6">
                                Je hebt recentelijk de beleidsbeslissing
                                <span className="font-bold mx-1">
                                    Duurzame groei van het toerisme in
                                    Zuid-Holland
                                </span>
                                toegevoegd. We hebben gezien dat deze
                                beleidsbeslissing nog niet is gekoppeld aan een
                                andere beleidsbeslissing. We raden je aan om dit
                                aan te passen.
                            </p>
                        </CardAlgemeneMelding>
                        <CardAlgemeneMelding
                            icon="faExclamationTriangle"
                            titel="Wijziging in gekoppeld object"
                            buttonText="Bekijk artikel 6.18"
                        >
                            <p className="text-gray-800 text-sm mb-6">
                                Op 2 februari heeft John Doe
                                <span className="font-bold mx-1">
                                    Artikel 3.14 (Verbod geitenhouderij)
                                </span>
                                gewijzigd. Omdat
                                <span className="font-bold mx-1">
                                    Artikel 6.18 (Agrarische bedrijven)
                                </span>
                                genoemd wordt binnen Artikel 3.14, vragen we je
                                te controleren of deze wijzigingen gevolgen
                                heeft voor jouw artikel.
                            </p>
                        </CardAlgemeneMelding>
                    </KaartenGroep>
                </div>
            </div>
        )
    }
}

export default MuteerDashboard
