import { Heading } from '@pzh-ui/components'
import { PersonDigging } from '@pzh-ui/icons'
import { Helmet } from 'react-helmet-async'

import { Container } from '@/components/Container'

const MaintenancePage = () => (
    <>
        <Helmet title="Onderhoud pagina">
            <meta
                property="og:title"
                content="Onderhoud pagina - Omgevingsbeleid Provincie Zuid-Holland"
            />
            <meta
                property="og:description"
                content="Onderhoud pagina waarop staat beschreven dat deze applicatie aan het updaten is."
            />
        </Helmet>
        <div className="h-full w-full py-20">
            <Container>
                <div className="col-span-6 flex flex-col items-center space-y-2 text-center">
                    <PersonDigging
                        size={160}
                        className="text-pzh-blue-500 mb-4"
                    />
                    <Heading size="xxl">
                        Deze applicatie is even aan het updaten
                    </Heading>
                    <Heading level="2" size="l">
                        Excuses voor het ongemak
                    </Heading>
                </div>
            </Container>
        </div>
    </>
)

export default MaintenancePage
