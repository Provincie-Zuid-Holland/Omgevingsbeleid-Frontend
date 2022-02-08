import { ReactNode } from 'react'

import { Container } from '@/components/Container'
import Footer from '@/components/Footer'
import Heading from '@/components/Heading'
import Text from '@/components/Text'

const RaadpleegMapSearch = () => (
    <>
        <Container>
            <div className="col-span-6 mb-8 lg:mb-16 lg:col-span-2">
                <Heading
                    level="1"
                    className="mt-4 text-3xl font-bold md:mt-12 lg:mt-16 text-pzh-blue">
                    Zoeken op de kaart
                </Heading>
                <Text type="introduction-paragraph" className="mt-3">
                    Een stukje pakkende tekst wat vertelt dat dit eigenlijk meer
                    voor andere overheden en grote bedrijven is, dan voor de
                    bezoeker die een schuurtje in zijn tuin wilt bouwen.
                </Text>

                <InfoText
                    title="Teken een gebied"
                    description="Teken eenvoudig een gebied op de kaart via het polygon teken
                    ( ), is de vorm gesloten, dan worden de resultaten van dit
                    gebied getoond."
                />

                <InfoText
                    title="Plaats een speld"
                    description="Plaats een speld ( ) om in een radius van 10 km (?) te
                    zoeken naar onderdelen uit het Omgevingsbeleid."
                />

                <InfoText
                    title="Werkingsgebied"
                    description="Selecteer een werkingsgebied om het gekoppelde beleid in te zien"
                />
            </div>
        </Container>

        <Footer />
    </>
)

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
