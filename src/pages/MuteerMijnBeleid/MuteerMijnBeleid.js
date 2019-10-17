import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import API
import axios from './../../API/axios'

// Import Components
import MijnBeleid from './../../components/MijnBeleid'
import SidebarMain from './../../components/SidebarMain'

class MuteerMijnBeleid extends Component {
    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8">
                <Helmet>
                    <title>Omgevingsbeleid - Mijn Beleid</title>
                </Helmet>
                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <section>
                        <h2 className="heading-serif mb-4 mt-8">Mijn beleid</h2>

                        <MijnBeleid authUser={this.props.authUser} />
                    </section>
                </div>
            </div>
        )
    }
}

export default MuteerMijnBeleid
