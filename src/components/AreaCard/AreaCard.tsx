import { Button, Heading } from '@pzh-ui/components'

interface AreaCardProps {
    image?: string | null
    title: string
    link: string
}

const AreaCard = ({ image, title, link }: AreaCardProps) => (
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
                <Button as="a" href={link}>
                    Bekijk gebiedsprogramma
                </Button>
            </div>
        </div>
    </div>
)

export default AreaCard
