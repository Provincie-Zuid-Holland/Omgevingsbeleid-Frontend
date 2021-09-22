import React from "react"
import { Helmet } from "react-helmet"

// Import Components
import ContainerMain from "./../../components/ContainerMain"
import MijnBeleid from "./../../components/MijnBeleid"
import SidebarMain from "./../../components/SidebarMain"

/**
 *
 * @param {object} authUser - contains the logged in user object
 * @returns The page where the user can see his/her policies
 */
const MuteerMijnBeleid = ({ authUser }) => {
    return (
        <ContainerMain>
            <Helmet>
                <title>Omgevingsbeleid - Mijn Beleid</title>
            </Helmet>

            {/* Sidebar */}
            <SidebarMain />

            {/* Dashboard */}
            <div className="relative flex-grow inline-block w-3/4 pl-8 rounded">
                <section>
                    <h2 className="mb-4 text-gray-800">Mijn beleid</h2>

                    <MijnBeleid authUser={authUser} />
                </section>
            </div>
        </ContainerMain>
    )
}

export default MuteerMijnBeleid
