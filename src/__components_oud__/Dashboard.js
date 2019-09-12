import React, { Component } from 'react'
import MainSidebar from './MainSidebar'

// Import UI Cards voor aandachtspunten sectie
import AandachtsPuntenKoppeling from './UI/AandachtsPunten/AandachtsPuntenKoppeling'
import AandachtsPuntenEigenaarOverdracht from './UI/AandachtsPunten/AandachtsPuntenEigenaarOverdracht'
import AandachtsPuntenAlgemeneMelding from './UI/AandachtsPunten/AandachtsPuntenAlgemeneMelding'

class KaartenGroep extends Component {
    render() {
        return (
            <div className="w-full inline-block relative">
                {this.props.children}
            </div>
        )
    }
}

class Dashboard extends Component {
    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8">
                {/* Sidebar */}
                <MainSidebar />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <h2 className="heading-serif mb-4">Aandachtspunten (x)</h2>

                    <KaartenGroep groepsNaam="Integraal">
                        <AandachtsPuntenKoppeling />
                        <AandachtsPuntenEigenaarOverdracht />
                    </KaartenGroep>

                    <KaartenGroep groepsNaam="Meedenkend">
                        <AandachtsPuntenAlgemeneMelding
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
                        </AandachtsPuntenAlgemeneMelding>
                    </KaartenGroep>

                    <KaartenGroep groepsNaam="Controlerend">
                        <AandachtsPuntenAlgemeneMelding
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
                        </AandachtsPuntenAlgemeneMelding>
                        <AandachtsPuntenAlgemeneMelding
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
                        </AandachtsPuntenAlgemeneMelding>
                    </KaartenGroep>
                </div>
            </div>
        )
    }
}

export default Dashboard
