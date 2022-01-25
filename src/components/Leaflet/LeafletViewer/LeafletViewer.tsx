import { faSearch } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Leaflet, { LatLngExpression, Marker } from 'leaflet'
import Proj from 'proj4leaflet'
import { useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import {
    Map,
    TileLayer,
    LayersControl,
    FeatureGroup,
    Viewport,
} from 'react-leaflet'
import { toast } from 'react-toastify'

import { getAddressData } from '@/api/axiosLocatieserver'
import {
    RDProj4,
    RDCrs,
    leafletBounds,
    tileURL,
    tileURLSattelite,
    leafletCenter,
} from '@/constants/leaflet'

import {
    LeafletController,
    LeafletDrawController,
    LeafletSearchInput,
} from '..'

// @ts-ignore
delete Leaflet.Icon.Default.prototype._getIconUrl

Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

const DEFAULT_VIEWPORT = {
    zoom: 4,
}

/**
 * Class that sets the state for a certain amount of variables and create a reference for the leafletMap and leafletSearch variable and binds certain variables.
 */

interface LeafletViewerProps {
    className?: string
    onChange?: (prop: any) => void
}

const LeafletViewer = ({
    className,
    onChange: providedOnChange,
}: LeafletViewerProps) => {
    const [showLeafletSearch, setShowLeafletSearch] = useState(false)
    const [activeSearchMarker, setActiveSearchMarker] = useState<Marker | null>(
        null
    )

    const leafletMap = useRef<Map>(null)
    const leafletSearch = useRef<HTMLInputElement>(null)

    /**
     * Function that creates a custom popup with the parameters lat, lng and layer.
     */
    const createCustomPopup = (lat: number, lng: number, layer: any) => {
        layer.bindPopup('Adres aan het laden...').openPopup()

        getAddressData(lat.toString(), lng.toString())
            .then(data => {
                const customPopupHTML = `<div>${ReactDOMServer.renderToString(
                    <CreateCustomPopup
                        weergavenaam={data.weergavenaam}
                        lat={lat}
                        lng={lng}
                        point={RDProjection.project({ lat: lat, lng: lng })}
                    />
                )}</div>`
                layer._popup.setContent(customPopupHTML)
            })
            .catch(function (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const onCreated = (e: any) => {
        const type = e.layerType

        if (type === 'marker') {
            // Do marker specific actions
            createCustomPopup(e.layer._latlng.lat, e.layer._latlng.lng, e.layer)
        }

        onChange()
    }

    const onDeleted = () => {
        onChange()
    }

    let editableFG: any = null

    const onFeatureGroupReady = (reactFGref: any) => {
        // store the ref for future access to content
        editableFG = reactFGref
    }

    const onChange = () => {
        // editableFG contains the edited geometry, which can be manipulated through the leaflet API
        if (!editableFG || !providedOnChange) {
            return
        }

        const geojsonData = editableFG.leafletElement.toGeoJSON()
        providedOnChange(geojsonData)
    }

    /**
     * Function that sets the leafletSearch parameter to a toggled stat of leafletSearch.
     */
    const toggleLeafletSearch = () => {
        setShowLeafletSearch(!showLeafletSearch)

        if (leafletSearch.current && showLeafletSearch) {
            leafletSearch.current.select()
        }
    }

    /**
     * Function to set the zoomLevel of each type parameter value based on the value. Also to set the state of activeSearchMarker to the markerID value and create a popup pased on the parameters.
     */
    const mapPanTo = (lng: number, lat: number, type: string) => {
        let zoomLevel
        switch (type) {
            case 'adres':
                zoomLevel = 10
                break
            case 'postcode':
                zoomLevel = 12
                break
            case 'weg':
                zoomLevel = 14
                break
            case 'woonplaats':
                zoomLevel = 7
                break
            case 'gemeente':
                zoomLevel = 8
                break
            case 'provincie':
                zoomLevel = 5
                break
            default:
                zoomLevel = 5
        }

        const markerID = Leaflet.marker(Leaflet.latLng(lng, lat)).addTo(
            leafletMap.current!.leafletElement
        )

        if (activeSearchMarker) {
            leafletMap.current!.leafletElement.removeLayer(activeSearchMarker)
        }

        setActiveSearchMarker(markerID)

        // Create popup
        const coordinates = Leaflet.latLng(lng, lat)
        createCustomPopup(coordinates.lat, coordinates.lng, markerID)

        leafletMap.current!.leafletElement.setView(
            Leaflet.latLng(lng, lat),
            zoomLevel
        )
    }

    return (
        <Map
            center={leafletCenter as LatLngExpression}
            viewport={DEFAULT_VIEWPORT as Viewport}
            scrollWheelZoom
            maxZoom={12}
            zoomControl
            crs={RDCrs}
            ref={leafletMap}
            className={`z-0 ${className || ''}`}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Map">
                    <TileLayer
                        url={tileURL}
                        minZoom={3}
                        continuousWorld="true"
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satelliet">
                    <TileLayer
                        url={tileURLSattelite}
                        minZoom={3}
                        continuousWorld="true"
                        wmts={false}
                        attribution='Map data: <a href="http://www.kadaster.nl">Kadaster</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <LeafletController position="topleft">
                <div
                    id="leaflet-search"
                    className="relative z-10 flex items-center justify-between h-10 bg-white rounded shadow cursor-pointer">
                    <div
                        className={`w-10 h-10 flex justify-center items-center text-gray-600 hover:text-gray-700 ${
                            showLeafletSearch
                                ? 'border-r border-gray-300'
                                : null
                        }`}
                        onClick={toggleLeafletSearch}>
                        <FontAwesomeIcon
                            className="inline-block w-10 text-lg cursor-pointer"
                            icon={faSearch}
                            onClick={toggleLeafletSearch}
                        />
                    </div>
                    {showLeafletSearch ? (
                        <LeafletSearchInput
                            mapPanTo={mapPanTo}
                            reference={leafletSearch}
                        />
                    ) : null}
                </div>
            </LeafletController>
            <FeatureGroup ref={reactFGref => onFeatureGroupReady(reactFGref)}>
                <LeafletDrawController
                    position="topleft"
                    // @ts-ignore
                    onCreated={onCreated}
                    onDeleted={onDeleted}
                    draw={{
                        marker: true,
                        polygon: false,
                        circle: false,
                        rectangle: false,
                        polyline: false,
                        circlemarker: false,
                    }}
                />
            </FeatureGroup>
        </Map>
    )
}

/**
 * Function to create a custom Popup
 *
 * @param {array} weergavenaam - Parameter used to show a string weergavenaam.
 * @param {Float} lat - Parameter used as a latitude value for the GPS location.
 * @param {float} lng - Paramter used as a longitude value for the GPS location.
 * @param {object} point - Parameter that is used in a url to show a certain location based on the parameters lat and lng.
 */

interface CreateCustomPopupProps {
    weergavenaam: string
    lat: number
    lng: number
    point: {
        x: number
        y: number
    }
}

const CreateCustomPopup = ({
    weergavenaam,
    lat,
    lng,
    point,
}: CreateCustomPopupProps) => (
    <div className="text-sm custom-popup">
        <span className="block font-bold">Gemarkeerde Locatie</span>
        <ul className="mt-1 mb-4 text-xs">
            <li>{weergavenaam.split(',')[0]}</li>
            <li>{weergavenaam.split(',')[1]}</li>
            <li>
                GPS Locatie: {lat.toFixed(7)}, {lng.toFixed(7)}
            </li>
        </ul>
        <a
            href={`/zoekresultaten?geoQuery=${point.x.toFixed(
                2
            )}+${point.y.toFixed(2)}&LatLng=${lat.toFixed(7)}-${lng.toFixed(
                7
            )}`}
            className="inline-block p-2 text-white rounded cursor-pointer bg-pzh-blue hover:bg-blue-600 focus:outline-none focus:ring">
            Bekijk provinciaal beleid van deze locatie
        </a>
    </div>
)

export default LeafletViewer
