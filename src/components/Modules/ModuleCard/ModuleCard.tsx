import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { useNavigate } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import useModuleManagers from '@/hooks/useModuleManagers'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const ModuleCard = (props: Module) => {
    const navigate = useNavigate()

    const managers = useModuleManagers(props)

    const { Module_ID, Title, Description, Status, Closed } = props

    return (
        <li className="p-5 border border-pzh-gray-200 rounded h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between mb-4">
                <Heading level="3">{Title}</Heading>
                <Badge
                    text={Status?.Status.replace('-', ' ') || ''}
                    variant={getModuleStatusColor(Status?.Status)}
                    upperCase={false}
                    className="-mt-1"
                />
            </div>
            <Text className="mb-4 text-[16px]">{Description}</Text>
            <div className="mt-auto flex items-center justify-between">
                {!Closed && (
                    <Button
                        size="small"
                        variant="cta"
                        onPress={() =>
                            navigate(`/muteer/modules/${Module_ID}`)
                        }>
                        Bekijk module
                    </Button>
                )}
                <div className="flex ml-auto">
                    {managers?.[0] && (
                        <Avatar name={managers[0].Gebruikersnaam} isSmall />
                    )}
                    {managers?.[1] && (
                        <Avatar
                            name={managers[1].Gebruikersnaam}
                            className="-ml-1.5"
                            isSmall
                        />
                    )}
                </div>
            </div>
        </li>
    )
}

export default ModuleCard
