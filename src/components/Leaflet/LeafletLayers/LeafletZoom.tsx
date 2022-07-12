import { Minus, Plus } from '@pzh-ui/icons'
import { ControlPosition } from 'leaflet'
import { useMap } from 'react-leaflet'

import LeafletController from '../LeafletController'

interface LeafletZoomProps {
    position?: ControlPosition
}

const LeafletZoom = ({ position = 'bottomleft' }: LeafletZoomProps) => {
    const map = useMap()

    return (
        <LeafletController position={position}>
            <div
                className="leaflet-zoom relative z-10 flex items-center justify-center h-8 w-8 bg-white cursor-pointer"
                onClick={() => map.zoomIn()}>
                <Plus size={16} className="inline-block cursor-pointer" />
            </div>
            <div
                className="leaflet-zoom relative z-10 flex items-center justify-center h-8 w-8 bg-white cursor-pointer"
                onClick={() => map.zoomOut()}>
                <Minus size={16} className="inline-block cursor-pointer" />
            </div>
        </LeafletController>
    )
}

export default LeafletZoom
