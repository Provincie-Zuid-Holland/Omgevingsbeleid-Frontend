import { Badge, Heading, Text } from '@pzh-ui/components'

import { Link } from 'react-router-dom'

import { Module, ModuleShort } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'

const ModuleTile = ({
    title,
    description,
    status,
    module_id,
}: Module | ModuleShort) => (
    <Link
        to={`/muteer/modules/${module_id}`}
        data-testid="dashboard-module-tile"
        className="group flex flex-col justify-between rounded border border-pzh-gray-200 p-6">
        <div className="mb-4">
            <Heading level="3" size="m">
                {title}
            </Heading>
            <Text size="s" className="line-clamp-3">
                {description}
            </Text>
        </div>
        <div className="flex items-center justify-between">
            <Badge
                text={status?.status.replace('-', ' ') || ''}
                variant={getModuleStatusColor(status?.status)}
                upperCase={false}
                className="whitespace-nowrap"
            />
            <button className="text-s text-pzh-green-500 underline group-hover:text-pzh-green-900 group-hover:no-underline">
                Bekijk module
            </button>
        </div>
    </Link>
)

export default ModuleTile
