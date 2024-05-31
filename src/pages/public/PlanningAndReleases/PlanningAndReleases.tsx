import { Divider, Heading, Text } from '@pzh-ui/components'
import {
    ArrowUpRightFromSquare,
    Check,
    Code,
    Cubes,
    FileExport,
    FileLines,
    UniversalAccess,
} from '@pzh-ui/icons'
import { ReactNode, useState } from 'react'

import { Container } from '@/components/Container'
import { releases } from '@/constants/releases'
import { strings } from '@/constants/strings'
import imagePlanningAndReleases from '@/images/planning-and-releases.webp'

type Releases = typeof releases

const PlanningAndReleases = () => (
    <div>
        <Container className="overflow-hidden">
            <div className="col-span-6 mb-0 pt-8 sm:mb-16 lg:col-span-3 lg:mb-0 lg:pt-16">
                <Heading level="1" size="xxl">
                    Planning & Releases
                </Heading>
                <Text size="l" className="mt-3">
                    Digitaal Omgevingsbeleid is altijd in ontwikkeling, benieuwd
                    waar we aan werken? Op deze pagina vind je de recent
                    opgeleverde functionaliteiten en een planning voor de
                    langere termijn.
                </Text>
                <Text className="mt-4 sm:mt-8">
                    Uiteraard vinden wij het fijn om feedback en input te
                    ontvangen. Heb je vragen, ideeën of suggesties? Neem gerust
                    contact op met ons via{' '}
                    <a
                        href={`mailto:${strings.LBL_EMAIL}`}
                        className="text-pzh-green-500 underline hover:text-pzh-green-900">
                        {strings.LBL_EMAIL}
                    </a>
                    .
                </Text>
            </div>
            <div className="relative col-span-3 hidden min-h-[480px] lg:block">
                <div className="absolute left-0 top-0 h-[480px] w-[50vw] bg-pzh-gray-100 text-center sm:inline-block">
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
        <Container className="pb-8 lg:pb-12">
            <Heading className="col-span-6 mt-6 sm:mt-8" level="2">
                Belangrijke ontwikkelingen
            </Heading>
            <Text className="col-span-6 mt-4">
                Ons ontwikkelteam werkt volgens de Agile methodiek, korte
                iteraties (sprints) waar na elke iteratie iets wordt opgeleverd.
                Na een aantal sprints wordt er een groter geheel opgeleverd.
                Deze grotere onderdelen hebben wij op een roadmap staan.
            </Text>
            <ul className="col-span-6 grid grid-cols-6 gap-x-10 gap-y-0">
                <OntwikkelingenListItem
                    title="Exports automatiseren"
                    icon={<FileExport size={22} />}>
                    Als provincie willen we het publiceren van ons beleid
                    automatiseren. Daardoor wordt het eenvoudiger en sneller om
                    ons beleid te exporteren naar het landelijk Omgevingsloket.
                </OntwikkelingenListItem>
                <OntwikkelingenListItem
                    title="Digitoegankelijk"
                    icon={<UniversalAccess size={22} />}>
                    Als overheid zijn we ervan overtuigd dat iedereen ons beleid
                    moet kunnen vinden. Daarom maken we het systeem
                    digitoegankelijk zodat iedereen er gebruik van kan maken.
                </OntwikkelingenListItem>
                <OntwikkelingenListItem
                    title="Open Source"
                    icon={<Code size={22} />}>
                    De code die wordt geschreven door ons team stellen we ook
                    beschikbaar aan andere overheden. Op die manier kunnen
                    andere overheden meedenken en makkelijker een eigen systeem
                    maken.
                </OntwikkelingenListItem>
                <OntwikkelingenListItem
                    title="Zoeken op de kaart"
                    icon={<Check size={22} />}>
                    Het zoeken op de kaart willen we verbeteren. Door onder
                    andere gebieden te kunnen tekenen krijg je meer informatie
                    en betere zoekresultaten te zien.
                </OntwikkelingenListItem>
                <OntwikkelingenListItem
                    title="Inhoudelijke verrijking"
                    icon={<FileLines size={22} />}>
                    Het complete omgevingsbeleid moet straks terug te vinden
                    zijn in deze omgeving. Daarom zullen we de komende tijd aan
                    de slag gaan om de database uit te breiden.
                </OntwikkelingenListItem>
                <OntwikkelingenListItem
                    title="Modulair Werken"
                    icon={<Cubes size={22} />}>
                    Vaak worden meerdere wijzigingen tegelijkertijd in ons
                    beleid doorgevoerd. Met modulair werken willen we dit beter
                    ondersteunen zodat direct helder wordt wat er wordt
                    aangepast.
                </OntwikkelingenListItem>
            </ul>
        </Container>
        <Divider />
        <Container className="pt-8 lg:pt-12">
            <Heading className="col-span-6" level="2">
                Releases
            </Heading>
            <Text className="col-span-6 mt-4">
                Wanneer er onderdelen ontwikkeld en getest zijn door ons team,
                dan zetten wij deze nieuwe onderdelen online. Hieronder zie je
                een overzicht van de releases inclusief de onmschrijving wat er
                wanneer online is gekomen.
            </Text>
            <ReleaseList releases={releases} />
        </Container>
    </div>
)

const ReleaseList = ({ releases = [] }: { releases: Releases }) => {
    const amountToIncrease = 4
    const defaultViewAmount = 2

    const [currentViewAmount, setCurrentViewAmount] =
        useState(defaultViewAmount)

    const increaseViewAmount = () => {
        if (releases.length < currentViewAmount + amountToIncrease) {
            setCurrentViewAmount(releases.length)
        } else {
            setCurrentViewAmount(currentViewAmount + amountToIncrease)
        }
    }

    return (
        <ul className="col-span-6 grid grid-cols-6 gap-x-10 gap-y-0">
            {releases
                .filter((_, idx) => idx < currentViewAmount)
                .map(release => (
                    <ReleaseListItem
                        key={release.title}
                        title={release.title}
                        date={release.date}
                        description={release.description}
                        items={release.items}
                    />
                ))}
            {releases.length > currentViewAmount ? (
                <li
                    onClick={increaseViewAmount}
                    className="col-span-6 cursor-pointer py-4 text-pzh-green-500 underline hover:text-pzh-green-900 lg:col-span-5 lg:col-start-2">
                    Toon meer releases
                </li>
            ) : null}
        </ul>
    )
}

interface ReleaseListItemProps {
    title: string
    date: string
    description: string
    items: Releases[0]['items']
}

const ReleaseListItem = ({
    title,
    description,
    date,
    items,
}: ReleaseListItemProps) => (
    <li className="relative col-span-6 mt-4 border-b border-pzh-gray-300 pb-8 sm:mt-8">
        <div className="col-span-6 grid grid-cols-6 gap-x-10 gap-y-0">
            <div className="col-span-6 text-pzh-gray-600 lg:col-span-1">
                {date}
            </div>
            <div className="col-span-6 lg:col-span-5">
                <Heading
                    color="text-pzh-pink-900"
                    className="mt-4 lg:mt-0"
                    level="3"
                    size="m">
                    {title}
                </Heading>
                <Text className="mt-3">{description}</Text>
                {Object.keys(items).map(key => (
                    <div key={key} className="mt-6">
                        <span className="inline-block font-bold">{key}</span>
                        <ul className="pl-6">
                            {items[key as keyof typeof items]?.map(
                                (item, index) => {
                                    if (typeof item === 'string') {
                                        return (
                                            <li
                                                key={index}
                                                className="list-outside list-disc pl-1">
                                                {item}
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li
                                                key={index}
                                                className="list-outside list-disc pl-1">
                                                {item.item}
                                                {item.children && (
                                                    <ul className="pl-6">
                                                        {item.children.map(
                                                            (
                                                                child,
                                                                childIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        childIndex
                                                                    }
                                                                    className="list-outside list-[circle] pl-1">
                                                                    {child.item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                            </li>
                                        )
                                    }
                                }
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </li>
)

const OntwikkelingenListItem = ({
    children,
    title,
    icon,
}: {
    children: ReactNode
    title: string
    icon?: JSX.Element
}) => (
    <li className="relative col-span-6 mt-6 pl-8 sm:mt-8 lg:col-span-3">
        <span className="absolute left-0 h-4 w-4 text-pzh-pink-900">
            {icon ? icon : <ArrowUpRightFromSquare size={22} />}
        </span>
        <div>
            <Heading level="3" size="m" color="text-pzh-pink-900">
                {title}
            </Heading>
            <p className="mt-2">{children}</p>
        </div>
    </li>
)

export default PlanningAndReleases
