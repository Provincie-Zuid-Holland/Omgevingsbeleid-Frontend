import { Transition } from '@headlessui/react'
import { FieldSelect, Heading, Text } from '@pzh-ui/components'
import { ArrowLeft, DrawPolygon, LocationDot } from '@pzh-ui/icons'
import Leaflet, { latLng, Map } from 'leaflet'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useWerkingsgebiedenGet } from '@/api/fetchers'
import { LeafletSearchInput } from '@/components/Leaflet'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'
import useSearchParam from '@/hooks/useSearchParam'

import { MAP_OPTIONS } from '../MapSearch'
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

    const { data, isLoading } = useWerkingsgebiedenGet({ limit: 500 })
    const selectedVal = useMemo(
        () => data?.results.find(item => item.UUID === paramWerkingsgebied),
        [data, paramWerkingsgebied]
    )

    const goBack = () => {
        navigate(MAP_SEARCH_PAGE)

        mapInstance?.fireEvent('draw:deletestart')

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
        <div className="relative z-1 flex px-4 md:px-0 md:shadow-pane">
            <Transition
                show={!searchOpen}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="-ml-570"
                enterTo="ml-0"
                leave="transition-all ease-in duration-300 transform"
                leaveFrom="ml-0"
                leaveTo="-ml-570"
                className="overflow-auto pb-8 pt-4 md:min-w-570 md:max-w-570 md:px-10 md:pt-12 lg:px-20 lg:pb-16 lg:pt-16">
                <Heading level="1">Zoeken op de kaart</Heading>
                <Text type="introduction-paragraph" className="mt-3">
                    Via deze pagina kun je uitgebreid zoeken welk beleid op
                    welke locatie van toepassing is. Hiermee wordt duidelijk wat
                    de provincie Zuid-Holland in een bepaald gebied wil
                    bereiken. Veel beleid is kaderstellend en richtinggevend van
                    aard en daarom bedoeld om aan te geven waar de provincie
                    voor staat en belang aan hecht.
                </Text>
                <InfoText
                    title="Teken een gebied of plaats een speld"
                    description={
                        <>
                            Teken eenvoudig een gebied (
                            {
                                <DrawPolygon
                                    size={18}
                                    className="mx-0.5 -mt-0.5 inline-block"
                                />
                            }
                            ), of plaats een speld (
                            {
                                <LocationDot
                                    size={18}
                                    className="mx-0.5 -mt-0.5 inline-block"
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
                        <div className="relative mt-2">
                            <LeafletSearchInput
                                mapInstance={mapInstance}
                                drawCallback={onDraw}
                                placeholder="Geef een adres op"
                            />
                        </div>
                    </>
                )}

                <InfoText
                    title="Werkingsgebied"
                    description="Selecteer een werkingsgebied om het gekoppelde beleid in te zien."
                />
                {data && (
                    <FieldSelect
                        className="mt-2"
                        id="select-werkingsgebied"
                        name="werkingsgebied"
                        options={
                            data.results?.map(item => ({
                                label: item.Title || '',
                                value: item.UUID || '',
                            })) || []
                        }
                        value={
                            (selectedVal && {
                                label: selectedVal.Title || '',
                                value: selectedVal.UUID || '',
                            }) ||
                            null
                        }
                        components={{
                            IndicatorSeparator: () => null,
                        }}
                        aria-label="Selecteer een werkingsgebied"
                        placeholder="Selecteer een werkingsgebied"
                        menuPortalTarget={
                            document.getElementById(
                                'select-werkingsgebied-portal'
                            ) as HTMLElement
                        }
                        menuPlacement="auto"
                        isLoading={isLoading}
                        onChange={val => {
                            set(
                                'werkingsgebied',
                                (val as { value: string })?.value || ''
                            )
                        }}
                    />
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
                className="h-full w-12">
                <button
                    onClick={() => goBack()}
                    className="flex h-full w-full items-center py-4 md:block md:py-0">
                    <div className="flex justify-center md:pt-4">
                        <ArrowLeft size={18} />
                    </div>
                    <div className="ml-2 flex h-full flex-col justify-center md:ml-0">
                        <p className="whitespace-nowrap md:-mt-8 md:-rotate-90 md:transform">
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
