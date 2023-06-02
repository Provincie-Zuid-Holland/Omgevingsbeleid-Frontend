import { Button, Heading } from '@pzh-ui/components'
import { useNavigate } from 'react-router-dom'

interface AreaCardProps {
    image?: string | null
    title: string
    link: string
}

const AreaCard = ({ image, title, link }: AreaCardProps) => {
    const navigate = useNavigate()

    return (
        <div className="rounded-t overflow-hidden h-full flex flex-col">
            {image ? (
                <img src={image} alt={title} className="h-40 object-cover" />
            ) : (
                <div className="h-40 bg-pzh-gray-200" />
            )}
            <div className="rounded-b border border-pzh-gray-400 p-6 flex flex-1 flex-col">
                <Heading level="3" className="mb-4">
                    {title}
                </Heading>
                <div className="mt-auto">
                    <Button onPress={() => navigate(link)}>
                        Bekijk gebiedsprogramma
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AreaCard
