import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'

const ModuleTile = ({ Title, Description, Status, Module_ID }: Module) => (
    <Link
        to={`/muteer/modules/${Module_ID}`}
        data-testid="dashboard-module-tile"
        className="group border-pzh-gray-200 flex flex-col justify-between rounded border p-6">
        <div className="mb-4">
            <Heading level="3" size="m">
                {Title}
            </Heading>
            <Text size="s" className="line-clamp-3">
                {Description}
            </Text>
        </div>
        <div className="flex items-center justify-between">
            <Badge
                text={Status?.Status.replace('-', ' ') || ''}
                variant={getModuleStatusColor(Status?.Status)}
                upperCase={false}
                className="whitespace-nowrap"
            />
            <Button
                variant="link"
                size="small"
                className="text-pzh-green-500 group-hover:text-pzh-green-900 group-hover:no-underline">
                Bekijk module
            </Button>
        </div>
    </Link>
)

export default ModuleTile
