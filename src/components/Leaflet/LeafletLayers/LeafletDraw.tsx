import 'leaflet-draw/dist/leaflet.draw-src.css'
import 'leaflet-draw'

import leaflet, { Control, ControlPosition, Point } from 'leaflet'
import { useState } from 'react'
import { FeatureGroup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import markerIcon from '@/images/marker.svg'

import { createControlComponent } from '../LeafletController'
import { createCustomPopup } from '../utils'

// @ts-ignore
delete leaflet.Icon.Default.prototype._getIconUrl

leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon,
    iconUrl: markerIcon,
    shadowUrl: null,
})

const LEAFLET_EDIT_CLASS = 'leaflet-draw-edit-edit'
const LEAFLET_HIDE_CLASS = 'hide-leaflet-edit'

interface LeafletDrawProps {
    position?: ControlPosition
    onDraw?: (callback: any) => void
}

const LeafletDraw = ({ position = 'topleft', onDraw }: LeafletDrawProps) => {
    const map = useMap()
    const navigate = useNavigate()
    const [currentLayerType, setCurrentLayerType] = useState<string | null>(
        null
    )

    const editEl = document.getElementsByClassName(LEAFLET_EDIT_CLASS)

    const onCreated = (e: any) => {
        const type = e.layerType

        setCurrentLayerType(type)

        if (type === 'marker') {
            // Do marker specific actions
            createCustomPopup(
                map,
                navigate,
                e.layer._latlng.lat,
                e.layer._latlng.lng,
                e.layer,
                'marker',
                onDraw
            )
        } else if (type === 'polygon') {
            // Do polygon specific actions
            const { lat, lng } = e.layer._map.getBounds().getCenter()
            createCustomPopup(
                map,
                navigate,
                lat,
                lng,
                e.layer,
                'polygon',
                onDraw
            )
        }
    }

    useUpdateEffect(() => {
        if (currentLayerType === 'marker') {
            editEl[0].classList.add(LEAFLET_HIDE_CLASS)
        } else {
            editEl[0].classList.remove(LEAFLET_HIDE_CLASS)
        }
    }, [currentLayerType])

    return (
        <FeatureGroup>
            <EditControl position={position} onCreated={onCreated} />
        </FeatureGroup>
    )
}

const customMarker = leaflet.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new Point(15, 15),
        iconSize: new Point(30, 30),
        iconUrl: markerIcon,
    },
})

const EditControl = createControlComponent(
    (options: Control.DrawConstructorOptions) =>
        new Control.Draw({
            ...options,
            draw: {
                circle: false,
                rectangle: false,
                polyline: false,
                circlemarker: false,
                marker: {
                    icon: new customMarker(),
                },
            },
        })
)

// @ts-ignore
leaflet.drawLocal = {
    draw: {
        toolbar: {
            // #TODO: this should be reorganized where actions are nested in actions
            // ex: actions.undo  or actions.cancel
            actions: {
                title: 'Annuleren',
                text: 'Annuleren',
            },
            finish: {
                title: 'Gereed',
                text: 'Gereed',
            },
            undo: {
                title: 'Ongedaan maken',
                text: 'Ongedaan maken',
            },
            buttons: {
                polyline: '',
                polygon: 'Klik op de kaart om een gebied te tekenen',
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
                    text: 'Klik op een marker om deze te verwijderen',
                },
            },
        },
    },
}

export default LeafletDraw
