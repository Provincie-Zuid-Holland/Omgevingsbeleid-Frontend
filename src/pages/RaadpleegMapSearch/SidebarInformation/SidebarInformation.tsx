import {
    faArrowLeft,
    faDrawPolygon,
    faMapMarkerAlt,
} from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import axios from 'axios'
import Leaflet, { latLng, Map } from 'leaflet'
import { ReactNode, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useWindowScroll } from 'react-use'

import { getGeoJsonData } from '@/api/axiosGeoJSON'
import { useGetValidWerkingsgebieden } from '@/api/fetchers'
import Heading from '@/components/Heading'
import { LeafletSearchInput } from '@/components/Leaflet'
import Text from '@/components/Text'

import { MAP_OPTIONS } from '../RaadpleegMapSearch'

type SelectedOption = { label: string; value: string }

interface SidebarInformationProps {
    mapInstance: Map | null
    searchOpen: boolean
    onDraw: (callback: any) => Promise<void>
}

const SidebarInformation = ({
    mapInstance,
    searchOpen,
    onDraw,
}: SidebarInformationProps) => {
    const history = useHistory()
    const location = document.location.toString()
    const searchParams = new URL(location).searchParams

    const [werkingsgebied, setWerkingsgebied] =
        useState<Leaflet.Proj.GeoJSON | null>(null)

    const searchInput = useRef<HTMLInputElement>(null)

    const { data, isLoading } = useGetValidWerkingsgebieden()

    useWindowScroll()

    const goBack = () => {
        searchParams.delete('searchOpen')
        history.replace({
            search: searchParams.toString(),
        })

        /**
         * Remove all markers and polygons from map
         */
        mapInstance?.eachLayer((layer: any) => {
            if (!!layer._latlng || !!layer._svgSize) {
                mapInstance.removeLayer(layer)
            }
        })

        const coordinates = latLng(MAP_OPTIONS.center[0], MAP_OPTIONS.center[1])
        mapInstance?.setView(coordinates, MAP_OPTIONS.zoom)
        mapInstance?.invalidateSize()
    }

    const onScopeSelect = async (selected?: SelectedOption | null) => {
        if (!selected || !mapInstance) return

        if (werkingsgebied && mapInstance.hasLayer(werkingsgebied)) {
            mapInstance.removeLayer(werkingsgebied)
        }

        return await getGeoJsonData('Werkingsgebieden', selected.value)
            .then(res => {
                const geoJsonLayer = Leaflet.Proj.geoJson(res, {
                    onEachFeature: (feature, layer) => {
                        if (feature.properties) {
                            console.log(feature, layer)
                            /*
                            const { lat, lng } = layer._map.getBounds().getCenter()
                            createCustomPopup(
                                map,
                                history,
                                lat,
                                lng,
                                e.layer,
                                'polygon',
                                onDraw
                            )
                            */
                            layer.bindPopup(
                                feature.properties.Gebied
                                    ? feature.properties.Gebied
                                    : 'Deze laag heeft nog geen titel'
                            )
                        }
                    },
                })

                setWerkingsgebied(geoJsonLayer)

                geoJsonLayer.addTo(mapInstance)
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled -', err.message)
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    return (
        <div className="flex shadow-pane relative z-1">
            <Transition
                show={!searchOpen}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="-ml-570"
                enterTo="ml-0"
                leave="transition-all ease-in duration-300 transform"
                leaveFrom="ml-0"
                leaveTo="-ml-570"
                className="pb-8 lg:pb-16 pt-4 md:pt-12 lg:pt-16 lg:px-20 max-w-570 min-w-570">
                <Heading level="1">Zoeken op de kaart</Heading>
                <Text type="introduction-paragraph" className="mt-3">
                    Een stukje pakkende tekst wat vertelt dat dit eigenlijk meer
                    voor andere overheden en grote bedrijven is, dan voor de
                    bezoeker die een schuurtje in zijn tuin wilt bouwen.
                </Text>
                <InfoText
                    title="Teken een gebied of plaats een speld"
                    description={
                        <>
                            Teken eenvoudig een gebied (
                            {
                                <FontAwesomeIcon
                                    icon={faDrawPolygon}
                                    className="text-base mx-0.5"
                                />
                            }
                            ), of plaats een speld (
                            {
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="text-base mx-0.5"
                                />
                            }
                            ) op de kaart.
                        </>
                    }
                />

                {mapInstance && (
                    <>
                        <InfoText
                            title="Zoek op adres"
                            description="Geef een adres op, om te zoeken op die locatie."
                        />
                        <div className="mt-2 relative">
                            <LeafletSearchInput
                                mapInstance={mapInstance}
                                drawCallback={onDraw}
                                ref={searchInput}
                                placeholder="Geef een adres op"
                                classes="block w-full h-2.4 px-4 py-3 text-pzh-blue-dark text-opacity-50 text-sm border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                            />
                        </div>
                    </>
                )}

                <InfoText
                    title="Werkingsgebied"
                    description="Selecteer een werkingsgebied om het gekoppelde beleid in te zien."
                />
                <Select
                    className="mt-2"
                    id="select-werkingsgebied"
                    name="werkingsgebied"
                    options={
                        data?.map(item => ({
                            label: item.Werkingsgebied || '',
                            value: item.UUID || '',
                        })) || []
                    }
                    placeholder="Selecteer een werkingsgebied"
                    isLoading={isLoading}
                    menuPosition="fixed"
                    onChange={onScopeSelect}
                />
            </Transition>

            <Transition
                show={searchOpen}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="opacity-0 -ml-12"
                enterTo="opacity-100 ml-0"
                leave="transition-all ease-in duration-0 transform"
                leaveFrom="opacity-100 ml-0"
                leaveTo="opacity-0 -ml-12"
                className="w-12 h-full">
                <button onClick={() => goBack()} className="h-full w-full">
                    <div className="pt-4">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="text-base"
                        />
                    </div>
                    <div className="flex flex-col h-full justify-center">
                        <p className="-mt-8 transform -rotate-90 whitespace-nowrap">
                            Terug naar zoeken
                        </p>
                    </div>
                </button>
            </Transition>
        </div>
    )
}

const InfoText = ({
    title,
    description,
}: {
    title: string
    description: string | ReactNode
}) => (
    <div className="mt-8 ">
        <span className="block font-bold">{title}</span>
        <Text type="body" className="mt-1 block">
            {description}
        </Text>
    </div>
)

export default SidebarInformation
