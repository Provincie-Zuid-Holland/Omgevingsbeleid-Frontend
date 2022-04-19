import {
    faArrowLeft,
    faDrawPolygon,
    faMapMarkerAlt,
} from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import Leaflet, { latLng, Map } from 'leaflet'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

import { useGetValidWerkingsgebieden } from '@/api/fetchers'
import Heading from '@/components/Heading'
import { LeafletSearchInput } from '@/components/Leaflet'
import Text from '@/components/Text'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'
import useSearchParam from '@/hooks/useSearchParam'

import { MAP_OPTIONS } from '../RaadpleegMapSearch'
import { handleWerkingsgebiedSelect } from '../utils'

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
    const { get, set } = useSearchParam()
    const [paramWerkingsgebied] = get('werkingsgebied')
    const navigate = useNavigate()

    const [werkingsgebied, setWerkingsgebied] =
        useState<Leaflet.Proj.GeoJSON | null>(null)

    const searchInput = useRef<HTMLInputElement>(null)

    const { data, isLoading } = useGetValidWerkingsgebieden()
    const selectedVal = useMemo(
        () => data?.find(item => item.UUID === paramWerkingsgebied),
        [data, paramWerkingsgebied]
    )

    const goBack = () => {
        navigate(MAP_SEARCH_PAGE, { replace: true })

        /**
         * Remove all markers and polygons from map
         */
        mapInstance?.eachLayer((layer: any) => {
            if (!!layer._latlng || !!layer._svgSize) {
                mapInstance.removeLayer(layer)
            }
        })

        mapInstance?.fireEvent('draw:deleted')

        const coordinates = latLng(MAP_OPTIONS.center[0], MAP_OPTIONS.center[1])
        mapInstance?.setView(coordinates, MAP_OPTIONS.zoom)

        setTimeout(() => mapInstance?.invalidateSize(true), 350)
    }

    useEffect(() => {
        if (paramWerkingsgebied && mapInstance) {
            handleWerkingsgebiedSelect(
                mapInstance,
                navigate,
                werkingsgebied,
                setWerkingsgebied,
                {
                    label: '',
                    value: paramWerkingsgebied || '',
                }
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramWerkingsgebied, mapInstance])

    return (
        <div className="flex md:shadow-pane relative z-1 md:px-0 px-4">
            <Transition
                show={!searchOpen}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="-ml-570"
                enterTo="ml-0"
                leave="transition-all ease-in duration-300 transform"
                leaveFrom="ml-0"
                leaveTo="-ml-570"
                className="pb-8 lg:pb-16 pt-4 md:pt-12 lg:pt-16 lg:px-20 md:px-10 md:max-w-570 md:min-w-570 overflow-auto">
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
                                withSearchIcon
                                classes="block w-full h-2.4 pl-4 pr-8 pb-3 pt-3.5 placeholder-pzh-blue-dark placeholder-opacity-50 text-sm border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                            />
                        </div>
                    </>
                )}

                <InfoText
                    title="Werkingsgebied"
                    description="Selecteer een werkingsgebied om het gekoppelde beleid in te zien."
                />
                {data && (
                    <div className="form-select-container">
                        <Select
                            className="mt-2"
                            id="select-werkingsgebied"
                            name="werkingsgebied"
                            options={
                                data.map(item => ({
                                    label: item.Werkingsgebied || '',
                                    value: item.UUID || '',
                                })) || []
                            }
                            value={
                                (selectedVal && {
                                    label: selectedVal.Werkingsgebied || '',
                                    value: selectedVal.UUID || '',
                                }) ||
                                null
                            }
                            components={{
                                IndicatorSeparator: () => null,
                            }}
                            aria-label="Selecteer een werkingsgebied"
                            classNamePrefix="form-select"
                            placeholder="Selecteer een werkingsgebied"
                            menuPortalTarget={
                                document.getElementById(
                                    'select-werkingsgebied-portal'
                                ) as HTMLElement
                            }
                            menuPlacement="auto"
                            isLoading={isLoading}
                            onChange={val => {
                                set('werkingsgebied', val?.value || '')
                            }}
                        />
                    </div>
                )}
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
                <button
                    onClick={() => goBack()}
                    className="h-full w-full md:block flex items-center md:py-0 py-4">
                    <div className="md:pt-4">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="md:text-base text-sm"
                        />
                    </div>
                    <div className="flex flex-col h-full justify-center md:ml-0 ml-2">
                        <p className="md:-mt-8 md:transform md:-rotate-90 whitespace-nowrap">
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
