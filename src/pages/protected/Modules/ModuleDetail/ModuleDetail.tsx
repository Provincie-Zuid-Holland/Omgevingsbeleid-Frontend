import { TabItem, Tabs, TabsProps } from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import {
    matchPath,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'

import { LoaderContent } from '@/components/Loader'
import ModuleHeader from '@/components/Modules/ModuleHeader'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

type TabType = 'objecten' | 'besluiten' | 'tijdlijn'
type RestrictedTabType = 'Mine' | 'Others'

const TABS: TabType[] = ['objecten', 'besluiten', 'tijdlijn']
const RESTRICTED_TABS: RestrictedTabType[] = ['Mine', 'Others']

const getActiveTab = (pathname: string): TabType => {
    return (
        TABS.find(
            tab =>
                matchPath(`/muteer/modules/:moduleId/${tab}/*`, pathname) ||
                matchPath(`/muteer/modules/:moduleId/${tab}`, pathname)
        ) || 'objecten'
    )
}

const ModuleDetail = () => {
    const { moduleId } = useParams<{ moduleId: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const { canCreatePublication } = usePermissions()

    const { data: { Module: module } = {}, isLoading } = useModule()

    const activeTab = useMemo(
        () => getActiveTab(location.pathname),
        [location.pathname]
    )

    const [selectedRestrictedTab, setSelectedRestrictedTab] =
        useState<RestrictedTabType>('Mine')

    const handleTabChange: TabsProps['onSelectionChange'] = key => {
        navigate(
            `/muteer/modules/${moduleId}${key !== 'objecten' ? `/${key}` : ''}`
        )
    }

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title} hasOwnBreadcrumbs>
            <ModuleHeader module={module} />

            <div className="col-span-6">
                <Tabs
                    selectedKey={
                        canCreatePublication ? activeTab : selectedRestrictedTab
                    }
                    onSelectionChange={key => {
                        if (canCreatePublication) {
                            handleTabChange(key)
                        } else {
                            setSelectedRestrictedTab(key as RestrictedTabType)
                        }
                    }}>
                    {canCreatePublication
                        ? TABS.map(tab => (
                              <TabItem
                                  key={tab}
                                  title={
                                      tab === 'objecten'
                                          ? 'Onderdelen'
                                          : tab === 'besluiten'
                                            ? 'Besluiten'
                                            : 'Tijdlijn'
                                  }>
                                  <Outlet context={{ owners: 'All' }} />
                              </TabItem>
                          ))
                        : RESTRICTED_TABS.map(tab => (
                              <TabItem
                                  key={tab}
                                  title={
                                      tab === 'Mine'
                                          ? 'Mijn onderdelen'
                                          : 'Andere onderdelen'
                                  }>
                                  <Outlet context={{ owners: tab }} />
                              </TabItem>
                          ))}
                </Tabs>
            </div>
        </MutateLayout>
    )
}

export default ModuleDetail
