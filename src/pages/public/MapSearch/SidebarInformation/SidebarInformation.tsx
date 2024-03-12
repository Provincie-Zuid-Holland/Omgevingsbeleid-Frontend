import { Transition } from '@headlessui/react'
import { FieldSelect, Heading, Text } from '@pzh-ui/components'
import { ArrowLeft, DrawPolygon, LocationDot } from '@pzh-ui/icons'
import Leaflet, { latLng } from 'leaflet'
import groupBy from 'lodash.groupby'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSourceWerkingsgebiedenGet } from '@/api/fetchers'
import { LeafletSearchInput } from '@/components/Leaflet'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'
import useSearchParam from '@/hooks/useSearchParam'
import useMapStore from '@/store/mapStore'

import { MAP_OPTIONS } from '../MapSearch'
import { handleWerkingsgebiedSelect } from '../utils'

interface SidebarInformationProps {
    onDraw: (callback: any) => Promise<void>
}

const SidebarInformation = ({ onDraw }: SidebarInformationProps) => {
    const { get, set, remove } = useSearchParam()
    const [paramWerkingsgebied, sidebarOpen] = get([
        'werkingsgebied',
        'sidebarOpen',
    ])
    const navigate = useNavigate()

    const mapInstance = useMapStore(state => state.mapInstance)
    const setIsAreaLoading = useMapStore(state => state.setIsAreaLoading)

    const [werkingsgebied, setWerkingsgebied] =
        useState<Leaflet.TileLayer.WMS | null>(null)

    const { data, isLoading } = useSourceWerkingsgebiedenGet({
        limit: 1000,
        sort_column: 'Title',
        sort_order: 'ASC',
    })
    const selectedVal = useMemo(
        () => data?.results.find(item => item.UUID === paramWerkingsgebied),
        [data, paramWerkingsgebied]
    )

    const options = useMemo(() => {
        const filteredData = data?.results.filter(
            item =>
                !!item.Start_Validity &&
                !!item.End_Validity &&
                new Date(item.Start_Validity).getTime() <
                    new Date().getTime() &&
                new Date(item.End_Validity).getTime() > new Date().getTime()
        )

        const grouped = groupBy(filteredData, 'Title')
        const newest = Object.keys(grouped).map(item => {
            const label = item

            const sortedData = grouped[item].sort(
                (a, b) =>
                    new Date(b.Modified_Date).getTime() -
                    new Date(a.Modified_Date).getTime()
            )
            const value = sortedData[0].UUID

            return { label, value }
        })

        return newest
    }, [data])

    const goBack = () => {
        navigate(MAP_SEARCH_PAGE)

        mapInstance?.fireEvent('draw:deletestart')

        const coordinates = latLng(MAP_OPTIONS.center[0], MAP_OPTIONS.center[1])
        mapInstance?.setView(coordinates, MAP_OPTIONS.zoom)

        setIsAreaLoading(false)

        setTimeout(() => mapInstance?.invalidateSize(true), 350)
    }

    useEffect(() => {
        if (paramWerkingsgebied && mapInstance) {
            mapInstance.eachLayer((layer: any) => {
                if (!!layer._latlng || !!layer._svgSize) {
                    mapInstance.removeLayer(layer)
                }
            })

            handleWerkingsgebiedSelect(
                mapInstance,
                werkingsgebied,
                setWerkingsgebied,
                setIsAreaLoading,
                {
                    label: '',
                    value: paramWerkingsgebied || '',
                }
            )

            set('sidebarOpen', 'true')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramWerkingsgebied, mapInstance])

    return (
        <div className="relative z-1 flex px-4 md:px-0 md:shadow-pane">
            <Transition
                show={!sidebarOpen}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="-ml-[570px]"
                enterTo="ml-0"
                leave="transition-all ease-in duration-300 transform"
                leaveFrom="ml-0"
                leaveTo="-ml-[570px]"
                className="overflow-auto pb-8 pt-4 md:min-w-[570px] md:max-w-[570px] md:px-10 md:pt-12 lg:px-20 lg:pb-16 lg:pt-16">
                <Heading level="1" size="xxl">
                    Zoeken op de kaart
                </Heading>
                <Text size="l" className="mt-3">
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
                        options={options}
                        value={
                            (selectedVal && {
                                label: selectedVal.Title,
                                value: selectedVal.UUID,
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
                            remove('geoQuery')
                            set(
                                'werkingsgebied',
                                (val as { value: string })?.value
                            )
                        }}
                    />
                )}
            </Transition>

            <Transition
                show={sidebarOpen === 'true'}
                enter="transition-all ease-out duration-300 transform"
                enterFrom="opacity-0 -ml-12"
                enterTo="opacity-100 ml-0"
                leave="transition-all ease-in duration-[1ms] transform"
                leaveFrom="opacity-100 ml-0"
                leaveTo="opacity-0 -ml-12"
                className="h-full w-12">
                <button
                    onClick={goBack}
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
        <Text className="mt-1 block">{description}</Text>
    </div>
)

export default SidebarInformation
