import {
    Heading,
    Text,
    Tabs,
    TabItem,
    getHeadingStyles,
    Hyperlink,
    Button,
    ListLink,
} from '@pzh-ui/components'
import { AngleDown } from '@pzh-ui/icons'
import { useState } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion'
import { useNavigate } from 'react-router-dom'

import { useModulesGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import * as models from '@/config/objects'
import useAuth from '@/hooks/useAuth'
import useBreakpoint from '@/hooks/useBreakpoint'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

const Dashboard = () => {
    const { user, role } = useAuth()
    const { canCreateModule } = usePermissions()
    const navigate = useNavigate()
    const { isMobile } = useBreakpoint()

    const [activeTab, setActiveTab] = useState<string | number>('user')

    const { data: userModules, isLoading: userModulesLoading } = useModulesGet(
        {
            only_active: true,
            only_mine: true,
        },
        { query: { enabled: activeTab === 'user' } }
    )
    const { data: allModules, isLoading: allModulesLoading } = useModulesGet(
        {
            only_active: true,
        },
        { query: { enabled: activeTab !== 'user' } }
    )

    return (
        <MutateLayout title="Dashboard">
            <div className="col-span-3 mb-8">
                <Heading level="1" className="mb-3">
                    Welkom {user?.Gebruikersnaam}!
                </Heading>
                <Text type="body">
                    Het digitaal omgevingsbeleid van de provincie Zuid-Holland.
                    Hieronder een overzicht van onderdelen die voor jou relevant
                    zijn als {role?.toLowerCase()}.
                </Text>
            </div>

            <div className="col-span-6">
                <div>
                    <h2
                        className="mb-3"
                        style={getHeadingStyles('3', isMobile)}>
                        Modules
                    </h2>

                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={setActiveTab}>
                        <TabItem
                            key="user"
                            title={
                                canCreateModule
                                    ? 'Actieve modules'
                                    : 'Mijn actieve modules'
                            }>
                            <Items
                                items={userModules}
                                isLoading={userModulesLoading}
                            />

                            {!canCreateModule ? (
                                <div className="grid grid-cols-6 mt-8">
                                    <div className="col-span-3 mb-6">
                                        <Heading level="3" className="mb-4">
                                            Mijn beleid
                                        </Heading>
                                        <Text type="body">
                                            Binnen het digitaal omgevingsbeleid
                                            ben jij eigenaar van een aantal
                                            beleidskeuzes en maatregelen,
                                            hieronder vind je een overzicht van
                                            deze onderdelen.
                                        </Text>
                                    </div>

                                    <div className="col-span-6">
                                        <Accordion allowZeroExpanded>
                                            <AccordionItem>
                                                <AccordionItemHeading className="py-2 px-4 bg-pzh-gray-100 border-b border-pzh-gray-300">
                                                    <AccordionItemButton className="group flex items-center justify-between font-bold">
                                                        <span>
                                                            Beleidskeuzes (2)
                                                        </span>
                                                        <AngleDown className="transform duration-150 group-aria-expanded:rotate-180" />
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <div className="py-2 px-4 flex items-center justify-between border-b border-pzh-gray-300">
                                                        <span>
                                                            Het stimuleren van
                                                            de transitie naar
                                                            een Circulair
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
                                                            Beleidsregels (1)
                                                        </span>
                                                        <AngleDown className="transform duration-150 group-aria-expanded:rotate-180" />
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                    <div className="py-2 px-4 flex items-center justify-between border-b border-pzh-gray-300">
                                                        <span>
                                                            Het stimuleren van
                                                            de transitie naar
                                                            een Circulair
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
                                                    '/muteer/modules/nieuw'
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
                                            Hieronder vind je een overzicht van
                                            alle onderdelen.
                                        </Text>

                                        <div className="grid grid-cols-2 mt-4">
                                            {Object.keys(models).map(key => {
                                                const model =
                                                    models[
                                                        key as keyof typeof models
                                                    ]

                                                return (
                                                    <ListLink
                                                        key={`link-${key}`}
                                                        text={
                                                            model.defaults
                                                                .pluralCapitalize
                                                        }
                                                        to={`/muteer/${model.defaults.plural}`}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabItem>
                        <TabItem
                            key="all"
                            title={
                                canCreateModule
                                    ? 'Alle modules'
                                    : 'Alle actieve modules'
                            }>
                            <Items
                                items={allModules}
                                isLoading={allModulesLoading}
                            />
                        </TabItem>
                    </Tabs>
                </div>
            </div>
        </MutateLayout>
    )
}

interface ItemsProps {
    isLoading: boolean
    items?: Module[]
}

const Items = ({ isLoading, items }: ItemsProps) => (
    <>
        {isLoading ? (
            <div className="mt-5 grid gap-9 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                <LoaderCard height="180" />
                <LoaderCard height="180" />
                <LoaderCard height="180" />
            </div>
        ) : (
            <>
                {items?.length ? (
                    <ul className="mt-5 grid gap-9 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                        {items.map(item => (
                            <ModuleCard key={item.Module_ID} {...item} />
                        ))}
                    </ul>
                ) : (
                    <span className="mt-3 block italic">
                        Geen modules gevonden.
                    </span>
                )}
            </>
        )}
    </>
)

export default Dashboard
