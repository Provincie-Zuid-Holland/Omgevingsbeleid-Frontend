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
                    <h2 className="heading-serif mb-4">Meldingen</h2>

                    <CardKoppeling />
                </div>
            </div>
        )
    }
}

export default MuteerDashboard
  