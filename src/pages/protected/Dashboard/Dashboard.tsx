import {
    Heading,
    Text,
    Tabs,
    TabItem,
    getHeadingStyles,
} from '@pzh-ui/components'
import { Helmet } from 'react-helmet'
import { useMedia } from 'react-use'

import { Container } from '@/components/Container'
import useAuth from '@/hooks/useAuth'

/**
 * @returns the Dashboard of the logged in user
 */
const Dashboard = () => {
    const { user } = useAuth()

    const isMobile = useMedia('(max-width: 640px)')

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Dashboard</title>
            </Helmet>

            <Container className="pt-10">
                <div className="col-span-3 mb-8">
                    <Heading level="1" className="mb-3">
                        Welkom {user?.Gebruikersnaam}!
                    </Heading>
                    <Text type="body">
                        Het digitaal omgevingsbeleid van de provincie
                        Zuid-Holland. Hieronder een overzicht van onderdelen die
                        voor jou relevant zijn als {user?.Rol?.toLowerCase()}.
                    </Text>
                </div>

                <div className="col-span-6">
                    <div>
                        <h2
                            className="mb-3"
                            style={getHeadingStyles('3', isMobile)}>
                            Modules
                        </h2>

                        <Tabs>
                            <TabItem title="Mijn actieve modules">
                                <div className="py-4">Mijn modules</div>
                            </TabItem>
                            <TabItem title="Alle actieve modules">
                                <div className="py-4">Alle modules</div>
                            </TabItem>
                        </Tabs>
                    </div>

                    <div className="mt-8">
                        <Heading level="3">Mijn beleid</Heading>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Dashboard
