import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { useNavigate } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const ModuleCard = ({ Module_ID, Title, Description, Status }: Module) => {
    const navigate = useNavigate()

    return (
        <li className="p-5 border border-pzh-gray-200 rounded h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <Heading level="3">{Title}</Heading>
                <Badge
                    text={Status?.Status || ''}
                    variant={getModuleStatusColor(Status?.Status)}
                    upperCase={false}
                />
            </div>
            <Text type="body-small" className="mb-4">
                {Description}
            </Text>
            <div className="mt-auto">
                <Button
                    size="small"
                    onPress={() => navigate(`/muteer/modules/${Module_ID}`)}>
                    Bekijk module
                </Button>
            </div>
        </li>
    )
}

export default ModuleCard
