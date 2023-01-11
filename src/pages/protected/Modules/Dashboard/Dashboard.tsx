import {
    Heading,
    Text,
    Tabs,
    TabItem,
    getHeadingStyles,
    Hyperlink,
    Button,
} from '@pzh-ui/components'
import { AngleDown } from '@pzh-ui/icons'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { useMedia } from 'react-use'

import { Container } from '@/components/Container'
import ModuleCard from '@/components/Modules/ModuleCard'
import useAuth from '@/hooks/useAuth'

/**
 * @returns the Dashboard of the logged in user
 */
const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const isMobile = useMedia('(max-width: 640px)')

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Dashboard</title>
            </Helmet>

            <Container className="pt-10 pb-20">
                <div className="col-span-3 mb-8">
                    <Heading level="1" className="mb-3">
                        Welkom {user?.Gebruikersnaam}!
                    </Heading>
                    <Text type="body">
                        Het digitaal omgevingsbeleid van de provincie
                        Zuid-Holland. Hieronder een overzicht van onderdelen die
                        voor jou relevant zijn als {user?.Rol?.toLowerCase()}.
                    </Text>
                </div>

                <div className="col-span-6">
                    <div>
                        <h2
                            className="mb-3"
                            style={getHeadingStyles('3', isMobile)}>
                            Modules
                        </h2>

                        <Tabs>
                            <TabItem title="Mijn actieve modules">
                                <ul className="mt-5 grid gap-9 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                                    <ModuleCard
                                        title="Koers 2022"
                                        link="/muteer/modules/1"
                                        description="Vivamus aliquam ligula rhoncus venenatis scelerisque. Etiam et ultricies nisl. Integer imperdiet quis ligula sed porttitor."
                                        status="Inactief"
                                    />
                                    <ModuleCard
                                        title="GP MOB"
                                        link="/muteer/modules/2"
                                        description="Vivamus aliquam ligula rhoncus venenatis scelerisque. Etiam et ultricies nisl. Integer imperdiet quis ligula sed porttitor."
                                        status="Inspraak"
                                    />
                                </ul>

                                {user?.Rol !== 'Beheer' ? (
                                    <div className="grid grid-cols-6 mt-8">
                                        <div className="col-span-3 mb-6">
                                            <Heading level="3" className="mb-4">
                                                Mijn beleid
                                            </Heading>
                                            <Text type="body">
                                                Binnen het digitaal
                                                omgevingsbeleid ben jij eigenaar
                                                van een aantal beleidskeuzes en
                                                maatregelen, hieronder vind je
                                                een overzicht van deze
                                                onderdelen.
                                            </Text>
                                        </div>

                                        <div className="col-span-6">
                                            <Accordion allowZeroExpanded>
                                                <AccordionItem>
                                                    <AccordionItemHeading className="py-2 px-4 bg-pzh-gray-100 border-b border-pzh-gray-300">
                                                        <AccordionItemButton className="group flex items-center justify-between font-bold">
                                                            <span>
                                                                Beleidskeuzes
                                                                (2)
                                                            </span>
                                                            <AngleDown className="transform duration-150 group-aria-expanded:rotate-180" />
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <div className="py-2 px-4 flex items-center justify-between border-b border-pzh-gray-300">
                                                            <span>
                                                                Het stimuleren
                                                                van de transitie
                                                                naar een
                                                                Circulair
                                                                Zuid-Holland
                                                            </span>
                                                            <Hyperlink
                                                                to="/"
                                                                text="Bekijk"
                                                            />
                                                        </div>
                                                        <div className="py-2 px-4 flex items-center justify-between border-b border-pzh-gray-300">
                                                            <span>
                                                                Stimuleren
                                                                groenparticipatie
                                                            </span>
                                                            <Hyperlink
                                                                to="/"
                                                                text="Bekijk"
                                                            />
                                                        </div>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem>
                                                    <AccordionItemHeading className="py-2 px-4 bg-pzh-gray-100 border-b border-pzh-gray-300">
                                                        <AccordionItemButton className="group flex items-center justify-between font-bold">
                                                            <span>
                                                                Beleidsregels
                                                                (1)
                                                            </span>
                                                            <AngleDown className="transform duration-150 group-aria-expanded:rotate-180" />
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <div className="py-2 px-4 flex items-center justify-between border-b border-pzh-gray-300">
                                                            <span>
                                                                Het stimuleren
                                                                van de transitie
                                                                naar een
                                                                Circulair
                                                                Zuid-Holland
                                                            </span>
                                                            <Hyperlink
                                                                to="/"
                                                                text="Bekijk"
                                                            />
                                                        </div>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-6 mt-8">
                                        <div className="col-span-6 mb-10">
                                            <Button
                                                variant="cta"
                                                size="small"
                                                onPress={() =>
                                                    navigate(
                                                        '/muteer/modules/nieuw',
                                                        { replace: true }
                                                    )
                                                }>
                                                Module toevoegen
                                            </Button>
                                        </div>
                                        <div className="col-span-3 mb-6">
                                            <Heading level="3" className="mb-4">
                                                Beleid
                                            </Heading>
                                            <Text type="body">
                                                Hieronder vind je een overzicht
                                                van alle onderdelen.
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </TabItem>
                            <TabItem title="Alle modules">
                                <ul className="mt-5 grid gap-9 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                                    <ModuleCard
                                        title="Koers 2022"
                                        link="/muteer/modules/1"
                                        description="Vivamus aliquam ligula rhoncus venenatis scelerisque. Etiam et ultricies nisl. Integer imperdiet quis ligula sed porttitor."
                                        status="Inactief"
                                    />
                                    <ModuleCard
                                        title="GP MOB"
                                        link="/muteer/modules/2"
                                        description="Vivamus aliquam ligula rhoncus venenatis scelerisque. Etiam et ultricies nisl. Integer imperdiet quis ligula sed porttitor."
                                        status="Inspraak"
                                    />
                                    <ModuleCard
                                        title="Energietransitie"
                                        link="/muteer/modules/3"
                                        description="Vivamus aliquam ligula rhoncus venenatis scelerisque. Etiam et ultricies nisl. Integer imperdiet quis ligula sed porttitor."
                                        status="Concept Ontwerp GS"
                                    />
                                </ul>
                            </TabItem>
                        </Tabs>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Dashboard
