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
                <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                    <section>
                        <h2 className="heading-serif text-gray-800">
                            Mijn beleid
                        </h2>

                        <MijnBeleid
                            hideToevoegen={true}
                            authUser={this.props.authUser}
                        />
                    </section>
                </div>
            </ContainerMain>
        )
    }
}

export default MuteerDashboard
