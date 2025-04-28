import { Heading, TabItem, Tabs, Text } from '@pzh-ui/components'
import classNames from 'clsx'
import { Helmet } from 'react-helmet-async'
import { useShallow } from 'zustand/react/shallow'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import NetworkGraph from '@/components/Network/NetworkGraph'
import useNetworkStore from '@/store/networkStore'

const META = {
    title: 'Beleidsnetwerk',
    description:
        'Het beleid van de provincie Zuid-Holland en de onderliggende koppelingen.',
}

const Network = () => {
    const { activeTab, setActiveTab } = useNetworkStore(
        useShallow(state => ({
            activeTab: state.activeTab,
            setActiveTab: state.setActiveTab,
        }))
    )

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', to: '/' },
        { name: 'Beleidsnetwerk' },
    ]

    return (
        <>
            <Helmet title={META.title}>
                <meta name="description" content={META.description} />
                <meta name="og:description" content={META.description} />
            </Helmet>

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
                        onderliggende koppelingen.
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
                            <div className="after:content-[' '] after:absolute after:left-0 after:top-[33px] after:-z-[1] after:h-full after:w-full after:bg-pzh-gray-100">
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
