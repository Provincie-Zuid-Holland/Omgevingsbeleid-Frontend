import { Button, Heading } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

interface AreaCardProps {
    image?: string | null
    title: string
    link: string
}

const AreaCard = ({ image, title, link }: AreaCardProps) => (
    <div className="flex h-full flex-col overflow-hidden rounded-t">
        {image ? (
            <img src={image} alt="" className="h-40 object-cover" />
        ) : (
            <div className="h-40 bg-pzh-gray-200" />
        )}
        <div className="flex flex-1 flex-col rounded-b border border-pzh-gray-400 p-6">
            <Heading level="3" size="m" className="mb-4">
                {title}
            </Heading>
            <div className="mt-auto">
                <Button asChild>
                    <Link to={link}>Bekijk gebiedsprogramma</Link>
                </Button>
            </div>
        </div>
    </div>
)

export default AreaCard
