import React from 'react'
import { Helmet } from 'react-helmet'

import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'

function MuteerMijnAccount(props) {
    return (
        <ContainerMain>
            <Helmet>
                <title>Omgevingsbeleid - Mijn Account</title>
            </Helmet>

            {/* Sidebar */}
            <SidebarMain />

            {/* Dashboard */}
            <div className="w-3/4 rounded inline-block flex-grow pl-8 relative">
                <section>
                    <h2 className="heading-serif text-gray-700 mb-4 mt-8">
                        Mijn Account
                    </h2>
                    <div>
                        <h3>Gebruikersnaam</h3>
                        <p>{props.authUser ? props.authUser.Rol : null}</p>
                        <h3>E-mail</h3>
                        <h3>Rol</h3>
                    </div>
                </section>
            </div>
        </ContainerMain>
    )
}

export default MuteerMijnAccount
