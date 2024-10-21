import { TabItem, Tabs, TabsProps } from '@pzh-ui/components'
import classNames from 'clsx'
import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import { LoaderContent } from '@/components/Loader'
import ModuleHeader from '@/components/Modules/ModuleHeader'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

type TabType = 'objecten' | 'besluiten'

export interface ModuleContext {
    object?: ModuleObjectShort
    module?: Module
}

const ModuleDetail = () => {
    const { canCreatePublication } = usePermissions()
    const navigate = useNavigate()
    const { moduleId, tab } = useParams<{ moduleId: string; tab?: TabType }>()

    const [activeTab, setActiveTab] = useState<TabType>(tab || 'objecten')

    const { data: { Module: module } = {}, isLoading } = useModule()

    const handleTabChange: TabsProps['onSelectionChange'] = key => {
        setActiveTab(key as TabType)

        navigate(
            `/muteer/modules/${moduleId}${
                key === 'besluiten' ? '/besluiten' : ''
            }`
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
                    onSelectionChange={handleTabChange}>
                    <TabItem title="Onderdelen" key="objecten">
                        <Outlet />
                    </TabItem>
                    <TabItem title="Besluiten" key="besluiten">
                        <Outlet />
                    </TabItem>
                </Tabs>
            </div>
        </MutateLayout>
    )
}

export default ModuleDetail
