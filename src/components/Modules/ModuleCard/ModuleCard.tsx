import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { useNavigate } from 'react-router-dom'

import { Module, ModuleShort } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import useModuleManagers from '@/hooks/useModuleManagers'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const ModuleCard = (props: Module | ModuleShort) => {
    const navigate = useNavigate()

    const managers = useModuleManagers(props)

    const { Module_ID, Title, Description, Status, Closed } = props

    return (
        <li
            className="p-5 border border-pzh-gray-200 rounded h-full flex flex-col"
            data-testid="module-card">
            <div className="flex flex-wrap items-center justify-between mb-3">
                <Badge
                    text={Status?.Status.replace('-', ' ') || ''}
                    variant={getModuleStatusColor(Status?.Status)}
                    upperCase={false}
                    className="-mt-1"
                />
                <div className="flex">
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
            <Heading level="3">{Title}</Heading>
            <Text className="mb-4 text-[16px] line-clamp-2">{Description}</Text>
            <div className="mt-auto">
                {!Closed && (
                    <Button
                        size="small"
                        variant="cta"
                        onPress={() => navigate(`/muteer/modules/${Module_ID}`)}
                        data-testid="module-card-button">
                        Bekijk module
                    </Button>
                )}
            </div>
        </li>
    )
}

export default ModuleCard
