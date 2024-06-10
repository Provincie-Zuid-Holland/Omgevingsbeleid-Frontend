import Leaflet, { Map } from 'leaflet'

import { getGeoserverLayer } from '@/api/axiosGeoJSON'

type SelectedOption = { label: string; value: string }

const handleWerkingsgebiedSelect = async (
    mapInstance: Map | null,
    werkingsgebied: Leaflet.TileLayer.WMS | null,
    setWerkingsgebied: (item: Leaflet.TileLayer.WMS | null) => void,
    setIsAreaLoading: (loading: boolean) => void,
    selected?: SelectedOption | null
) => {
    if (!selected || !mapInstance) return

    if (werkingsgebied && mapInstance.hasLayer(werkingsgebied)) {
        mapInstance.removeLayer(werkingsgebied)
    }

    const layerInstance = Leaflet.tileLayer.wms(
        `${
            import.meta.env.VITE_GEOSERVER_API_URL
        }/geoserver/Omgevingsbeleid/wms`,
        {
            layers: getGeoserverLayer(),
            version: '1.3.0',
            format: 'image/png',
            transparent: true,
            // @ts-ignore
            cql_filter: `UUID='${selected.value}'`,
            tiled: true,
            tileSize: 512,
        }
    )
    setWerkingsgebied(layerInstance)
    layerInstance.addTo(mapInstance)

    setIsAreaLoading(true)

    layerInstance.on('load', () => {
        setIsAreaLoading(false)
    })
}

export default handleWerkingsgebiedSelect
