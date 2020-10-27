import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import MijnBeleid from './../../components/MijnBeleid'

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
                <div className="relative flex-grow inline-block w-3/4 pl-8 rounded">
                    <section>
                        <h2 className="text-gray-800 heading-serif">
                            Mijn beleid
                        </h2>

                        <MijnBeleid
                            hideAddNew={true}
                            authUser={this.props.authUser}
                        />
                    </section>
                </div>
            </ContainerMain>
        )
    }
}

export default MuteerDashboard
