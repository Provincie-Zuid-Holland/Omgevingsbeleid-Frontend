import { Heading, Text } from '@pzh-ui/components'

import { DashboardAdmin, DashboardUser } from '@/components/Dashboard'
import useAuth from '@/hooks/useAuth'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

const Dashboard = () => {
    const { user, role } = useAuth()
    const { canCreateModule } = usePermissions()

    return (
        <MutateLayout title="Dashboard">
            <div className="col-span-6 lg:col-span-3 mb-8">
                <Heading level="1" className="mb-3">
                    Welkom {user?.Gebruikersnaam}!
                </Heading>
                <Text type="body">
                    Het digitaal omgevingsbeleid van de provincie Zuid-Holland.
                    Hieronder een overzicht van onderdelen die voor jou relevant
                    zijn als {role?.toLowerCase()}.
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
