import { TabItem, Tabs, TabsProps } from '@pzh-ui/components'
import classNames from 'clsx'
import { useMemo } from 'react'
import {
    matchPath,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import { LoaderContent } from '@/components/Loader'
import ModuleHeader from '@/components/Modules/ModuleHeader'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

type TabType = 'objecten' | 'besluiten' | 'tijdlijn'

const TABS: TabType[] = ['objecten', 'besluiten', 'tijdlijn']

const getActiveTab = (pathname: string): TabType => {
    return (
        TABS.find(
            tab =>
                matchPath(`/muteer/modules/:moduleId/${tab}/*`, pathname) ||
                matchPath(`/muteer/modules/:moduleId/${tab}`, pathname)
        ) || 'objecten'
    )
}

const getDisabledTabs = (
    objects?: ModuleObjectShort[],
    module?: Module
): TabType[] => {
    if (!objects?.length || !module?.Activated) return ['besluiten']
    return []
}

const ModuleDetail = () => {
    const { moduleId } = useParams<{ moduleId: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const { canCreatePublication } = usePermissions()

    const { data: { Module: module, Objects: objects } = {}, isLoading } =
        useModule()

    const activeTab = useMemo(
        () => getActiveTab(location.pathname),
        [location.pathname]
    )
    const disabledKeys = useMemo(
        () => getDisabledTabs(objects, module),
        [objects, module]
    )

    const handleTabChange: TabsProps['onSelectionChange'] = key => {
        navigate(
            `/muteer/modules/${moduleId}${key !== 'objecten' ? `/${key}` : ''}`
        )
    }

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title} hasOwnBreadcrumbs>
            <ModuleHeader module={module} />

            <div
                className={classNames('col-span-6', {
                    '[&_[role=tablist]]:hidden': !canCreatePublication,
                })}>
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={handleTabChange}
                    disabledKeys={disabledKeys}>
                    {TABS.map(tab => (
                        <TabItem
                            key={tab}
                            title={
                                tab === 'objecten'
                                    ? 'Onderdelen'
                                    : tab === 'besluiten'
                                      ? 'Besluiten'
                                      : 'Tijdlijn'
                            }>
                            <Outlet />
                        </TabItem>
                    ))}
                </Tabs>
            </div>
        </MutateLayout>
    )
}

export default ModuleDetail
