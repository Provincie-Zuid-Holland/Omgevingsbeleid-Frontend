import { Heading, Text } from '@pzh-ui/components'

import { DashboardAdmin, DashboardUser } from '@/components/Dashboard'
import useAuth from '@/hooks/useAuth'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import { formatRoles } from '@/utils/formatRoles'

const Dashboard = () => {
    const { user, roles } = useAuth()
    const { canCreateModule } = usePermissions()

    return (
        <MutateLayout title="Dashboard">
            <div className="col-span-6 mb-8 lg:col-span-3">
                <Heading level="1" size="xxl" className="mb-3">
                    Welkom {user?.Gebruikersnaam}!
                </Heading>
                <Text>
                    Het digitaal omgevingsbeleid van de provincie Zuid-Holland.
                    Hieronder een overzicht van onderdelen die voor jou relevant
                    zijn als {formatRoles(roles)}.
                </Text>
            </div>

            <div className="col-span-6">
                <Overview isAdmin={canCreateModule} />
            </div>
        </MutateLayout>
    )
}

interface OverviewProps {
    isAdmin: boolean
}

const Overview = ({ isAdmin }: OverviewProps) => {
    if (isAdmin) return <DashboardAdmin />

    return <DashboardUser />
}

export default Dashboard
