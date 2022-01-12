import { Container } from '../../components/Container'
import { useDnaBarWidth } from '../../components/DNABar'
import Breadcrumbs from './../../components/Breadcrumbs'
import Footer from './../../components/Footer'
import Heading from './../../components/Heading'
import Text from './../../components/Text'
import imgDigiToegankelijkheid from './../../images/digi-toegankelijkheid.png'

function RaadpleegDigiToegankelijkheid() {
    const dnaBarWidth = useDnaBarWidth()
    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Digitale toegankelijkheid', path: '/digi-toegankelijkheid' },
    ]

    return (
        <div>
            <div
                className="hidden w-full bg-center bg-no-repeat bg-cover bg-pzh-blue md:block"
                style={{
                    height: dnaBarWidth * 3 + 'px', // DNA Bar Width
                    backgroundImage: `url(${imgDigiToegankelijkheid})`,
                }}
            />
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6 md:col-span-4">
                    <Breadcrumbs paths={breadcrumbPaths} className="mt-6" />
                    <Heading level="1" className="mt-4 ">
                        {/* 👇🏻 Contains a soft hyphen */}
                        Toegankelijkheids­verklaring
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
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
                    <Text type="body" className="mt-3">
                        De toegankelijkheid van deze website is niet in zijn
                        geheel onderzocht. Dat zou een buitensporig grote
                        investering vergen. De meest bezochte en gebruikte
                        informatie en diensten zijn toegankelijk gemaakt volgens
                        bovenstaande normen. In het project Digitale
                        Toegankelijkheid bekijkt de provincie op welke manier
                        andere informatie en diensten op een toegankelijke
                        manier op aanvraag beschikbaar kunnen worden gesteld.
                    </Text>
                    <Text type="body" className="mt-3">
                        Loop je tegen een toegankelijkheidsprobleem aan? Of heb
                        je een vraag of opmerking over toegankelijkheid? Neem
                        dan contact op met ons Contact Centrum via{' '}
                        <a
                            href="mailto:zuidholland@pzh.nl"
                            className="text-pzh-green hover:text-pzh-green-dark">
                            zuidholland@pzh.nl
                        </a>{' '}
                        of kijk op{' '}
                        <a
                            href="www.zuid-holland.nl/contact"
                            target="_blank"
                            className="text-pzh-green hover:text-pzh-green-dark"
                            rel="noopener noreferrer">
                            www.zuid-holland.nl/contact
                        </a>
                        .
                    </Text>
                </div>
                <div className="col-span-6 mt-12">
                    <a
                        href="https://www.toegankelijkheidsverklaring.nl/register/6339"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img
                            src="https://www.toegankelijkheidsverklaring.nl/files/verklaring/label/af8d16e4762bcdbe16d268c44056bcfe.6339.svg"
                            alt="Digi-toegankelijkheids score"
                        />
                    </a>
                </div>
            </Container>
            <Footer />
        </div>
    )
}

export default RaadpleegDigiToegankelijkheid
