import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
import NetworkGraph from '@/components/Network/NetworkGraph'

const Network = () => {
    const pathName = location.pathname || ''

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', path: '/' },
        { name: 'Beleidsnetwerk' || '', path: pathName },
    ]

    return (
        <>
            <Helmet title="Beleidsnetwerk" />

            <Container className="pb-5 pt-4">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>
                <div className="col-span-6">
                    <Heading level="1">Beleidsnetwerk</Heading>
                    <Text className="mt-3 md:mt-4">
                        Het beleid van de provincie Zuid-Holland en de
                        onderliggende koppelingen
                    </Text>
                </div>
            </Container>

            <Container className="mb-16 bg-pzh-gray-100">
                <div className="col-span-6">
                    <NetworkGraph />
                </div>
            </Container>
        </>
    )
}

export default Network
