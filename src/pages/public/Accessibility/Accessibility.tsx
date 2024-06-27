import { Heading, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import imgDigiToegankelijkheid from '@/images/digi-toegankelijkheid.webp'

function Accessibility() {
    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Digitale toegankelijkheid', to: '/digi-toegankelijkheid' },
    ]

    return (
        <div>
            <Helmet title="Digitale toegankelijkheid" />

            <img
                src={imgDigiToegankelijkheid}
                alt=""
                className="hidden h-[288px] w-full bg-pzh-blue-500 object-cover md:block"
            />

            <Container className="overflow-hidden pb-20">
                <div className="col-span-6 md:col-span-4">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" size="xxl" className="mt-4 ">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Toegankelijkheids­verklaring
                    </Heading>
                    <Text size="l" className="mt-3">
                        De provincie Zuid-Holland vindt het belangrijk dat
                        iedereen alle informatie en diensten op onze website
                        goed kan lezen en gebruiken. Daarom werken we continu
                        aan het verbeteren van de toegankelijkheid van de
                        website www.zuid-holland.nl. We streven ernaar om te
                        voldoen aan belangrijke standaarden voor
                        toegankelijkheid (Europese norm EN 301 549, technische
                        standaard WCAG 2.1 van W3C, voorheen ‘de
                        webrichtlijnen’).
                    </Text>
                    <Text className="mt-3">
                        De toegankelijkheid van deze website is niet in zijn
                        geheel onderzocht. Dat zou een buitensporig grote
                        investering vergen. De meest bezochte en gebruikte
                        informatie en diensten zijn toegankelijk gemaakt volgens
                        bovenstaande normen. In het project Digitale
                        Toegankelijkheid bekijkt de provincie op welke manier
                        andere informatie en diensten op een toegankelijke
                        manier op aanvraag beschikbaar kunnen worden gesteld.
                    </Text>
                    <Text className="mt-3">
                        Loop je tegen een toegankelijkheidsprobleem aan? Of heb
                        je een vraag of opmerking over toegankelijkheid? Neem
                        dan contact op met ons Contact Centrum via{' '}
                        <a
                            href="mailto:zuidholland@pzh.nl"
                            className="text-pzh-green-500 underline hover:text-pzh-green-900">
                            zuidholland@pzh.nl
                        </a>{' '}
                        of kijk op{' '}
                        <a
                            href="www.zuid-holland.nl/contact"
                            target="_blank"
                            className="text-pzh-green-500 underline hover:text-pzh-green-900"
                            rel="noopener noreferrer">
                            www.zuid-holland.nl/contact
                        </a>
                        .
                    </Text>
                </div>
                <div className="col-span-6 mt-12 overflow-x-auto">
                    <a
                        href="https://www.toegankelijkheidsverklaring.nl/register/6339"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img
                            src="https://www.toegankelijkheidsverklaring.nl/files/verklaring/label/af8d16e4762bcdbe16d268c44056bcfe.6339.svg"
                            alt="Een afbeelding van de huidige status van de Digi Toegankelijkheid."
                        />
                    </a>
                </div>
            </Container>
        </div>
    )
}

export default Accessibility
