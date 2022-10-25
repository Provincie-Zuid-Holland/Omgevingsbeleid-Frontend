import { Button, Heading } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

interface AreaCardProps {
    image?: string
    title: string
    link: string
}

const AreaCard = ({ image, title, link }: AreaCardProps) => (
    <div className="rounded-t overflow-hidden h-full flex flex-col">
        {image ? (
            <img
                src={`data:image/jpeg;base64,${image}`}
                alt={title}
                className="h-40 object-cover"
            />
        ) : (
            <div className="h-40 bg-pzh-gray-200" />
        )}
        <div className="rounded-b border border-pzh-gray-400 p-6 flex flex-1 flex-col">
            <Heading level="3" className="mb-4">
                {title}
            </Heading>
            <Link to={link} className="mt-auto">
                <Button>Bekijk gebiedsprogramma</Button>
            </Link>
        </div>
    </div>
)

export default AreaCard
