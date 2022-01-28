import 'leaflet-draw/dist/leaflet.draw-src.css'

import leaflet, { ControlPosition } from 'leaflet'
import Proj from 'proj4leaflet'
import { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { toast } from 'react-toastify'

import { getAddressData } from '@/api/axiosLocatieserver'
import { RDProj4, leafletBounds, icons } from '@/constants/leaflet'

// @ts-ignore
const RDProjection = new Proj.Projection('EPSG:28992', RDProj4, leafletBounds)

const LEAFLET_MARKER_CLASS = 'leaflet-draw-draw-marker'
const LEAFLET_EDIT_CLASS = 'leaflet-draw-edit-edit'
const LEAFLET_REMOVE_CLASS = 'leaflet-draw-edit-remove'
const LEAFLET_HIDE_CLASS = 'hide-leaflet-edit'

interface LeafletDrawProps {
    position?: ControlPosition
}

const LeafletDraw = ({ position = 'topleft' }: LeafletDrawProps) => {
    const [currentLayerType, setCurrentLayerType] = useState<string | null>(
        null
    )

    /**
     * Function that creates a custom popup with the parameters lat, lng and layer.
     */
    const createCustomPopup = async (lat: number, lng: number, layer: any) => {
        layer.bindPopup('Adres aan het laden...').openPopup()

        await getAddressData(lat.toString(), lng.toString())
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

        setCurrentLayerType(type)

        if (type === 'marker') {
            // Do marker specific actions
            createCustomPopup(e.layer._latlng.lat, e.layer._latlng.lng, e.layer)
        }
    }

    useEffect(() => {
        const markerEl = document.getElementsByClassName(LEAFLET_MARKER_CLASS)
        markerEl[0].innerHTML = icons.marker

        const editEl = document.getElementsByClassName(LEAFLET_EDIT_CLASS)
        editEl[0].innerHTML = icons.edit

        const thrashEl = document.getElementsByClassName(LEAFLET_REMOVE_CLASS)
        thrashEl[0].innerHTML = icons.remove

        if (currentLayerType === 'marker') {
            editEl[0].classList.add(LEAFLET_HIDE_CLASS)
        } else {
            editEl[0].classList.remove(LEAFLET_HIDE_CLASS)
        }
    }, [currentLayerType])

    return (
        <FeatureGroup>
            <EditControl
                position={position}
                onCreated={onCreated}
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

// @ts-ignore
leaflet.drawLocal = {
    draw: {
        toolbar: {
            // #TODO: this should be reorganized where actions are nested in actions
            // ex: actions.undo  or actions.cancel
            actions: {
                title: 'Annuleren',
                text: 'Klik op de kaart om de marker te plaatsen',
            },
            finish: {
                title: 'Klik op de kaart om de marker te plaatsen',
                text: 'Klik op de kaart om de marker te plaatsen',
            },
            undo: {
                title: 'Ongedaan maken',
                text: 'Ongedaan maken',
            },
            buttons: {
                polyline: '',
                polygon: '',
                rectangle: '',
                circle: '',
                marker: 'Klik op de kaart om de marker te plaatsen',
                circlemarker: '',
            },
        },
        handlers: {
            circle: {
                tooltip: {
                    start: '',
                },
                radius: '',
            },
            circlemarker: {
                tooltip: {
                    start: '',
                },
            },
            marker: {
                tooltip: {},
            },
            polygon: {
                tooltip: {
                    start: '',
                    cont: '',
                    end: '',
                },
            },
            polyline: {
                error: '<strong>Error:</strong> Vorm grenzen mogen elkaar niet kruizen',
                tooltip: {
                    start: 'Klik om te beginnen met uw lijn',
                    cont: 'Klik om uw lijn voort te zetten',
                    end: 'Klik om uw lijn af te maken',
                },
            },
            rectangle: {
                tooltip: {
                    start: '',
                },
            },
            simpleshape: {
                tooltip: {
                    end: 'Laat uw muis los om uw vorm af te maken',
                },
            },
        },
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Wijzigingen opslaan',
                    text: 'Opslaan',
                },
                cancel: {
                    title: 'Annuleer wijzigingen',
                    text: 'Annuleren',
                },
                clearAll: {
                    title: 'Verwijder alle lagen',
                    text: 'Verwijder alles',
                },
            },
            buttons: {
                edit: 'Wijzig de lagen',
                editDisabled: 'Er zijn geen lagen om te wijzigen',
                remove: 'Verwijder lagen',
                removeDisabled: 'Er zijn geen lagen om te wijzigen',
            },
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Sleep een marker om hiervan de positie te wijzigen',
                    subtext:
                        'Klik op annuleren om de wijzigingen ongedaan te maken',
                },
            },
            remove: {
                tooltip: {
                    text: 'Click op een marker om deze te verwijderen',
                },
            },
        },
    },
}

export default LeafletDraw
