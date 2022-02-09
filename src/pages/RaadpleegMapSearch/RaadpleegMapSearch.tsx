import { faDrawPolygon, faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode, useMemo } from 'react'
import Select from 'react-select'

import { useGetWerkingsgebieden } from '@/api/fetchers'
import { Container } from '@/components/Container'
import Footer from '@/components/Footer'
import Heading from '@/components/Heading'
import { LeafletMap } from '@/components/Leaflet'
import SearchBar from '@/components/SearchBar'
import Text from '@/components/Text'

const RaadpleegMapSearch = () => {
    const { data, isLoading } = useGetWerkingsgebieden()

    const map = useMemo(
        () => (
            <LeafletMap
                controllers={{
                    showLayers: false,
                    showDraw: true,
                    showSearch: true,
                }}
            />
        ),
        []
    )

    return (
        <>
            <Container className="border-b">
                <div className="col-span-6 pb-8 lg:pb-16 pt-4 md:pt-12 lg:pt-16 lg:pr-4 lg:col-span-2">
                    <Heading level="1">Zoeken op de kaart</Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        Een stukje pakkende tekst wat vertelt dat dit eigenlijk
                        meer voor andere overheden en grote bedrijven is, dan
                        voor de bezoeker die een schuurtje in zijn tuin wilt
                        bouwen.
                    </Text>

                    <InfoText
                        title="Teken een gebied"
                        description={
                            <>
                                Teken eenvoudig een gebied op de kaart via het
                                polygon teken (
                                {
                                    <FontAwesomeIcon
                                        icon={faDrawPolygon}
                                        className="text-base mx-0.5"
                                    />
                                }
                                ), is de vorm gesloten, dan worden de resultaten
                                van dit gebied getoond.
                            </>
                        }
                    />

                    <InfoText
                        title="Plaats een speld"
                        description={
                            <>
                                Plaats een speld ({' '}
                                {
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="text-base mx-0.5"
                                    />
                                }{' '}
                                ) om te zoeken naar onderdelen uit het
                                Omgevingsbeleid.
                            </>
                        }
                    />

                    <InfoText
                        title="Werkingsgebied"
                        description="Selecteer een werkingsgebied om het gekoppelde beleid in te zien"
                    />
                    <Select
                        className="mt-2"
                        id="select-werkingsgebied"
                        name="rwerkingsgebied"
                        options={
                            data?.map(item => ({
                                label: item.Werkingsgebied,
                                value: item.ID,
                            })) || []
                        }
                        placeholder="Selecteer een werkingsgebied"
                        isLoading={isLoading}
                    />
                </div>

                <div className="col-span-6 lg:col-span-4">{map}</div>
            </Container>

            <Container>
                <div className="col-span-6 lg:col-span-4 lg:col-start-2 py-10">
                    <Heading level="3">Liever zoeken op tekst?</Heading>
                    <div>
                        <Text type="body" className="mt-4">
                            Waar bent u naar op zoek binnen het beleid van de
                            provincie Zuid-Holland?
                        </Text>
                        <SearchBar className="mt-2" />
                    </div>
                </div>
            </Container>

            <Footer />
        </>
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
        <span className="font-bold">{title}</span>
        <Text type="body" className="mt-1 block">
            {description}
        </Text>
    </div>
)

export default RaadpleegMapSearch
