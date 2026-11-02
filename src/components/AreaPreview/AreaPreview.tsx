import { LeafletTinyViewer } from '../Leaflet'

interface AreaPreviewProps {
    id?: string
}

const AreaPreview = ({ id }: AreaPreviewProps) => (
    <div className="relative z-0 flex w-full items-center justify-center overflow-hidden rounded bg-pzh-gray-100 text-center">
        <div className="h-120 w-full overflow-hidden rounded-lg">
            <LeafletTinyViewer id={id || ''} isSource />
        </div>
    </div>
)

export default AreaPreview
