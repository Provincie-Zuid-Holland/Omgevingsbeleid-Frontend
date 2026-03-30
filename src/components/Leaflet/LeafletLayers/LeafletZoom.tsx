import { ControlPosition } from 'leaflet'
import { useMap } from 'react-leaflet'

import { MinusLight, PlusLight } from '@pzh-ui/icons'

import LeafletController from '../LeafletController'

interface LeafletZoomProps {
    position?: ControlPosition
}

const LeafletZoom = ({ position = 'bottomleft' }: LeafletZoomProps) => {
    const map = useMap()

    return (
        <LeafletController position={position}>
            <button
                className="leaflet-zoom bg-pzh-white relative z-[10] flex h-10 w-10 cursor-pointer items-center justify-center"
                onClick={() => map.zoomIn()}
                type="button">
                <span className="sr-only">Inzoomen</span>
                <PlusLight size={16} className="inline-block cursor-pointer" />
            </button>
            <button
                className="leaflet-zoom bg-pzh-white relative z-[10] flex h-10 w-10 cursor-pointer items-center justify-center"
                onClick={() => map.zoomOut()}
                type="button">
                <span className="sr-only">Uitzoomen</span>
                <MinusLight size={16} className="inline-block cursor-pointer" />
            </button>
        </LeafletController>
    )
}

export default LeafletZoom
