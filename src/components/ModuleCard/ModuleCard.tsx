import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { useNavigate } from 'react-router-dom'

interface AreaCardProps {
    title: string
    link: string
    description: string
    status: string
}

const ModuleCard = ({ title, link, description, status }: AreaCardProps) => {
    const navigate = useNavigate()

    return (
        <li className="p-5 border border-pzh-gray-200 rounded h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <Heading level="3">{title}</Heading>
                <Badge text={status} variant="gray" upperCase={false} />
            </div>
            <Text type="body-small" className="mb-4">
                {description}
            </Text>
            <div className="mt-auto">
                <Button
                    size="small"
                    onPress={() => navigate(link, { replace: true })}>
                    Bekijk module
                </Button>
            </div>
        </li>
    )
}

export default ModuleCard
