import { Heading, Text } from '@pzh-ui/components'

import useAuth from '@/hooks/useAuth'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import { formatRoles } from '@/utils/formatRoles'
import Models from './components/Models'
import Modules from './components/Modules'
import UserObjects from './components/UserObjects'

const Dashboard = () => {
    const { user, roles } = useAuth()
    const { canViewPublication } = usePermissions()

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

            {canViewPublication && (
                <>
                    <div className="col-span-6 mb-4 lg:col-span-3 lg:col-start-1">
                        <Heading level="2" size="m" className="mb-3">
                            Onderdelen
                        </Heading>
                        <Text>
                            Als beheerder kan je alle onderdelen van het
                            digitaal omgevingsbeleid inzien en waar nodig
                            aanpassen. Hieronder vind je een lijst van de
                            onderdelen die voor jou als beheerder relevant zijn.
                        </Text>
                    </div>

                    <div className="col-span-6 mb-10">
                        <Models />
                    </div>
                </>
            )}

            <div className="col-span-6">
                <Modules />

                <div className="mt-10 grid grid-cols-6">
                    <UserObjects />
                </div>
            </div>
        </MutateLayout>
    )
}

export default Dashboard
