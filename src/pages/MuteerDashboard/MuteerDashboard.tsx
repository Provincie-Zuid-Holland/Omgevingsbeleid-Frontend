import { Helmet } from 'react-helmet'

import { ContainerMain } from '@/components/Container'
import MijnBeleid from '@/components/MijnBeleid'
import SidebarMain from '@/components/SidebarMain'

/**
 * @returns the Dashboard of the logged in user
 */
const MuteerDashboard = () => (
    <ContainerMain>
        <Helmet>
            <title>Omgevingsbeleid - Dashboard</title>
        </Helmet>

        {/* Sidebar */}
        <SidebarMain />

        {/* Dashboard */}
        <div className="relative flex-grow inline-block w-3/4 pl-8 rounded">
            <section>
                <h2 className="text-gray-800">Mijn beleid</h2>

                <MijnBeleid hideAddNew />
            </section>
        </div>
    </ContainerMain>
)

export default MuteerDashboard
