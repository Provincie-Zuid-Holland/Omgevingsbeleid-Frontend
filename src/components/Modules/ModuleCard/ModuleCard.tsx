import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { Module, ModuleShort } from '@/api/fetchers.schemas'
import Avatar from '@/components/Avatar'
import useModuleManagers from '@/hooks/useModuleManagers'
import { getModuleStatusColor } from '@/utils/module'

const ModuleCard = (props: Module | ModuleShort) => {
    const managers = useModuleManagers(props)

    const { Module_ID, Title, Description, Status, Closed } = props

    return (
        <li
            className="flex h-full flex-col rounded border border-pzh-gray-200 p-5"
            data-testid="module-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
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
            <Heading level="3" size="m">
                {Title}
            </Heading>
            <Text className="mb-4 line-clamp-2 text-s">{Description}</Text>
            <div className="mt-auto">
                {!Closed && (
                    <Button
                        asChild
                        size="small"
                        variant="cta"
                        data-testid="module-card-button">
                        <Link to={`/muteer/modules/${Module_ID}`}>
                            Bekijk module
                        </Link>
                    </Button>
                )}
            </div>
        </li>
    )
}

export default ModuleCard
