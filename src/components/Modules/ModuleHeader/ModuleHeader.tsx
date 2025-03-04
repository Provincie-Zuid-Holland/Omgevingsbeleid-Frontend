import { Badge, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import Breadcrumbs from '@/components/Breadcrumbs'
import useModule from '@/hooks/useModule'
import useModuleManagers from '@/hooks/useModuleManagers'
import usePermissions from '@/hooks/usePermissions'
import { getModuleStatusColor } from '@/utils/module'

interface ModuleHeaderProps {
    module: Module
}

const ModuleHeader = ({ module }: ModuleHeaderProps) => {
    const { canEditModule } = usePermissions()

    const { isModuleManager } = useModule()

    const managers = useModuleManagers(module)

    const breadcrumbPaths = [
        { name: 'Dashboard', to: '/muteer' },
        { name: 'Modules', to: '/muteer/modules' },
        { name: module?.Title || '' },
    ]

    return (
        <div className="col-span-6 mb-4">
            <div className="mb-4 flex items-center justify-between whitespace-nowrap">
                <Breadcrumbs items={breadcrumbPaths} />
                {(canEditModule || isModuleManager) && (
                    <Hyperlink asChild>
                        <Link to={`/muteer/modules/${module.Module_ID}/bewerk`}>
                            Module bewerken
                        </Link>
                    </Hyperlink>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className="w-[85%] flex-1 pr-4">
                    <div className="flex items-center">
                        <Heading level="1" size="xxl">
                            {module.Title}
                        </Heading>
                        <Badge
                            text={module.Status?.Status.replace('-', ' ') || ''}
                            upperCase={false}
                            className="-mt-2 ml-3 truncate"
                            variant={getModuleStatusColor(
                                module.Status?.Status
                            )}
                        />
                    </div>
                    <div>
                        <Text className="truncate" title={module.Description}>
                            {module.Description}
                        </Text>
                    </div>
                </div>
                <div className="flex">
                    {managers?.[0] && <Avatar uuid={managers[0].UUID} />}
                    {managers?.[1] && (
                        <Avatar uuid={managers[1].UUID} className="-ml-2" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModuleHeader
