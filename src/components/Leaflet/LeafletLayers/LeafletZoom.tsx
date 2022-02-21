import { faMinus, faPlus } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
            <div className="leaflet-zoom relative z-10 flex items-center justify-center h-8 w-8 bg-white cursor-pointer">
                <FontAwesomeIcon
                    className="inline-block cursor-pointer text-sm"
                    icon={faPlus}
                    onClick={() => map.zoomIn()}
                />
            </div>
            <div className="leaflet-zoom relative z-10 flex items-center justify-center h-8 w-8 bg-white cursor-pointer">
                <FontAwesomeIcon
                    className="inline-block text-sm cursor-pointer"
                    icon={faMinus}
                    onClick={() => map.zoomOut()}
                />
            </div>
        </LeafletController>
    )
}

export default LeafletZoom
