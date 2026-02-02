import { LeafletTinyViewer } from '../Leaflet'

interface AreaPreviewProps {
    UUID?: string
}

const AreaPreview = ({ UUID }: AreaPreviewProps) => (
    <div className="bg-pzh-gray-100 relative z-0 flex w-full items-center justify-center overflow-hidden rounded text-center">
        <div className="h-[500px] w-full overflow-hidden rounded-lg">
            <LeafletTinyViewer uuid={UUID || ''} isSource />
        </div>
    </div>
)

export default AreaPreview
