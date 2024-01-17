import { Breadcrumbs, Heading, TabItem, Tabs, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'

import { Container } from '@/components/Container'
import NetworkGraph from '@/components/Network/NetworkGraph'
import useNetworkStore from '@/store/networkStore'

const Network = () => {
    const activeTab = useNetworkStore(state => state.activeTab)
    const setActiveTab = useNetworkStore(state => state.setActiveTab)

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
                    <Heading level="1" size="xxl">
                        Beleidsnetwerk
                    </Heading>
                    <Text className="mt-3 md:mt-4">
                        Het beleid van de provincie Zuid-Holland en de
                        onderliggende koppelingen
                    </Text>
                </div>
            </Container>

            <Container
                className={classNames('relative mb-16', {
                    'overflow-hidden': activeTab === 'visual',
                })}>
                <div className="col-span-6">
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key =>
                            setActiveTab(key as typeof activeTab)
                        }>
                        <TabItem title="Visueel" key="visual">
                            <div className="after:content-[' '] after:absolute after:left-0 after:top-[33px] after:-z-1 after:h-full after:w-full after:bg-pzh-gray-100">
                                <NetworkGraph />
                            </div>
                        </TabItem>
                        <TabItem title="Tekstueel" key="textual">
                            <NetworkGraph />
                        </TabItem>
                    </Tabs>
                </div>
            </Container>
        </>
    )
}

export default Network
