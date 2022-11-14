import { Button, Heading } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

interface AreaCardProps {
    image?: string
    title: string
    link: string
}

const AreaCard = ({ image, title, link }: AreaCardProps) => (
    <div className="flex flex-col h-full overflow-hidden rounded-t">
        {image ? (
            <img src={image} alt={title} className="object-cover h-40" />
        ) : (
            <div className="h-40 bg-pzh-gray-200" />
        )}
        <div className="flex flex-col flex-1 p-6 border rounded-b border-pzh-gray-400">
            <Heading level="3" className="mb-4">
                {title}
            </Heading>
            <Link to={link} className="mt-auto">
                <Button label="Bekijk gebiedsprogramma" />
            </Link>
        </div>
    </div>
)

export default AreaCard
