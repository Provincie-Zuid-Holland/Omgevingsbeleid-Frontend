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
            <div className="relative flex-grow inline-block w-3/4 pl-8 rounded">
                <section>
                    <h2 className="mt-8 mb-4 text-gray-700">Mijn Account</h2>
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
