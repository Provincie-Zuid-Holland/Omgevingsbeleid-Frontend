import { Divider, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { Code, UniversalAccess } from '@pzh-ui/icons'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import imagePlanningAndReleases from '@/images/planning-and-releases.webp'

const About = () => (
    <div>
        <Helmet title="Over platform Omgevingsbeleid" />

        <Container className="overflow-hidden">
            <div className="col-span-6 mb-0 pt-8 sm:mb-16 lg:col-span-3 lg:mb-0 lg:pt-16">
                <Heading level="1" size="xxl">
                    Over platform Omgevingsbeleid
                </Heading>
                <Text size="l" className="mt-6">
                    Het platform Digitaal Omgevingsbeleid is altijd in
                    ontwikkeling. Op de achtergrond zijn er drie onderdelen waar
                    we aan werken; Deze omgeving die jij als gebruiker ziet, een
                    beheeromgeving van het beleid en een omgeving om het beleid
                    te publiceren naar de landelijke voorziening (Officiële
                    bekendmakingen).
                </Text>
                <Text className="mt-4 sm:mt-8">
                    Uiteraard vinden wij het fijn om feedback en input te
                    ontvangen. Heb je vragen, ideeën of suggesties? Neem gerust
                    contact op met ons via{' '}
                    <a
                        href="mailto:omgevingsbeleid@pzh.nl"
                        className="text-pzh-green-500 hover:text-pzh-green-900 underline">
                        omgevingsbeleid@pzh.nl
                    </a>
                    .
                </Text>
            </div>
            <div className="relative col-span-3 hidden min-h-[480px] lg:block">
                <div className="bg-pzh-gray-100 absolute top-0 left-0 h-[480px] w-[50vw] text-center sm:inline-block">
                    <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={imagePlanningAndReleases}
                    />
                </div>
            </div>
        </Container>
        <img
            src={imagePlanningAndReleases}
            alt=""
            className="mt-6 block h-64 w-full object-cover lg:hidden"
        />
        <Container className="py-8 lg:py-16">
            <div className="col-span-6">
                <Heading level="2" size="xl">
                    Waar wij aan werken...
                </Heading>
                <Text className="col-span-6 mt-4">
                    Het team wat werkt aan Platform Omgevingsbeleid werkt dus
                    aan deze raadpleegomgeving, de beheeromgeving en een
                    vertaling van het beleid naar de landelijke voorziening voor
                    bekendmakingen. Een overzicht van de werkzaamheden zijn
                    hieronder per omgeving getoond.
                </Text>
                <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div className="flex flex-col gap-2">
                        <Heading level="3" size="m">
                            Raadpleegomgeving
                        </Heading>
                        <Text>
                            De openbare omgeving (
                            <Hyperlink asChild>
                                <Link to="/">obzh.nl</Link>
                            </Hyperlink>
                            ) waar iedereen het huidige beleid, maar ook het
                            gearchiveerd en toekomstig beleid kan inzien.
                            Gebruikers kunnen zoeken op de kaart en verbindingen
                            tussen de beleidsobjecten inzien.
                        </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Heading level="3" size="m">
                            Muteeromgeving
                        </Heading>
                        <Text>
                            De beveiligde omgeving waar collega’s van de
                            provincie in werken. Hier kunnen zij hun beleid
                            aanpassen, verbindingen leggen tussen beleid en het
                            proces van besluitvorming voor hun beleid volgen.
                        </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Heading level="3" size="m">
                            Export naar de LVBB
                        </Heading>
                        <Text>
                            Zodra het beleid in inspraak gaat (ontwerp), of als
                            het besloten is (vastgesteld) moet het beleid worden
                            gepubliceerd op de Landelijke voorziening
                            bekendmaken en beschikbaar stellen (LVBB). Een
                            deelproject van het Platform Omgevingsbeleid is het
                            structureren en communiceren van onze visie en het
                            programma naar de LVBB en daarmee naar o.a.
                            <Hyperlink asChild>
                                <a
                                    href="https://www.officielebekendmakingen.nl/"
                                    target="_blank"
                                    rel="noreferrer noopener">
                                    Officiële bekendmakingen
                                </a>
                            </Hyperlink>{' '}
                            en{' '}
                            <Hyperlink asChild>
                                <a
                                    href="https://omgevingswet.overheid.nl/regels-op-de-kaart/"
                                    target="_blank"
                                    rel="noreferrer noopener">
                                    Regels op de kaart
                                </a>
                            </Hyperlink>
                            .
                        </Text>
                    </div>
                </div>
            </div>
        </Container>
        <Divider className="my-0" />
        <Container className="py-8 lg:py-16">
            <div className="col-span-6">
                <Heading level="2" size="xl">
                    Wat wij belangrijk vinden...
                </Heading>
                <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
                    <div className="flex gap-4">
                        <div className="-mt-0.5">
                            <Code size={30} color="text-pzh-blue-500" />
                        </div>
                        <div>
                            <Heading level="3" size="m" className="mb-2">
                                Open Source
                            </Heading>
                            <Text>
                                De code die wordt geschreven door ons team
                                stellen we ook beschikbaar aan andere overheden.
                                Op die manier kunnen andere overheden meedenken
                                en makkelijker een eigen systeem maken.
                            </Text>
                            <ul className="mt-4 flex flex-col gap-2">
                                <Hyperlink asChild>
                                    <li>
                                        <a
                                            href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-Frontend"
                                            target="_blank"
                                            rel="noreferrer noopener">
                                            Bekijk onze “Omgevingsbeleid
                                            Front-end” op Github
                                        </a>
                                    </li>
                                </Hyperlink>
                                <Hyperlink asChild>
                                    <li>
                                        <a
                                            href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-API"
                                            target="_blank"
                                            rel="noreferrer noopener">
                                            Bekijk onze “Omgevingsbeleid API” op
                                            Github
                                        </a>
                                    </li>
                                </Hyperlink>
                                <Hyperlink asChild>
                                    <li>
                                        <a
                                            href="https://github.com/Provincie-Zuid-Holland/Omgevingsbeleid-DSO"
                                            target="_blank"
                                            rel="noreferrer noopener">
                                            Bekijk onze “Omgevingsbeleid DSO” op
                                            Github
                                        </a>
                                    </li>
                                </Hyperlink>
                            </ul>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="-mt-0.5">
                            <UniversalAccess
                                size={30}
                                color="text-pzh-blue-500"
                            />
                        </div>
                        <div>
                            <Heading level="3" size="m" className="mb-2">
                                Digitoegankelijkheid
                            </Heading>
                            <Text className="mb-4">
                                Als overheid zijn we ervan overtuigd dat
                                iedereen ons beleid moet kunnen vinden. Daarom
                                maken we het systeem digitoegankelijk zodat
                                iedereen er gebruik van kan maken. Daarbij is de
                                front-end opgebouwd volgens ons eigen Design
                                System (welke voldoet aan de
                                digitoegankelijkheid).{' '}
                            </Text>
                            <Hyperlink asChild>
                                <a
                                    href="https://wapenfeiten.zuid-holland.nl/middelen/online/vormgeving-websites"
                                    target="_blank"
                                    rel="noreferrer noopener">
                                    Bekijk het Design System via de Wapenfeiten
                                    van de provincie
                                </a>
                            </Hyperlink>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </div>
)

export default About
