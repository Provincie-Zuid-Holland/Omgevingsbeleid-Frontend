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
import { FC, useState } from 'react'

import { Container } from '@/components/Container'
import { releases } from '@/constants/releases'
import imagePlanningAndReleases from '@/images/planning-and-releases.webp'

type Releases = typeof releases

const PlanningAndReleases = () => (
    <div>
        <Container className="overflow-hidden">
            <div className="col-span-6 mb-0 lg:col-span-3 sm:mb-16 lg:mb-0">
                <Heading level="1" className="mt-1 sm:mt-8 md:mt-12 lg:mt-16">
                    Planning & Releases
                </Heading>
                <Text type="introduction-paragraph" className="mt-3">
                    Digitaal Omgevingsbeleid is altijd in ontwikkeling, benieuwd
                    waar we aan werken? Op deze pagina vind je de recent
                    opgeleverde functionaliteiten en een planning voor de
                    langere termijn.
                </Text>
                <Text type="body" className="mt-4 sm:mt-8">
                    Uiteraard vinden wij het fijn om feedback en input te
                    ontvangen. Heb je vragen, ideeën of suggesties? Neem gerust
                    contact op met ons via{' '}
                    <a
                        href="mailto:omgevingsbeleid@pzh.nl"
                        className="text-pzh-green hover:text-pzh-green-dark">
                        omgevingsbeleid@pzh.nl
                    </a>
                    .
                </Text>
            </div>
            <div
                className="relative hidden col-span-3 lg:block"
                style={{ minHeight: '480px' }} // To mimick the height of the 480px div with the absolute position
            >
                <div
                    style={{
                        height: '480px',
                        width: 'calc(50vw)',
                    }}
                    className={`absolute text-center left-0 top-0 h-full bg-gray-100 sm:inline-block`}>
                    <img
                        alt="Afbeelding van twee maquettes"
                        className={`object-cover w-full h-full`}
                        src={imagePlanningAndReleases}
                    />
                </div>
            </div>
        </Container>
        <img
            src={imagePlanningAndReleases}
            alt="Afbeelding van twee maquettes"
            className="block w-full h-64 mt-6 bg-center bg-no-repeat bg-cover bg-pzh-blue lg:hidden image-home-1"
        />
        <Container className="pb-8 lg:pb-12">
            <Heading className="col-span-6 mt-6 sm:mt-8" level="2">
                Belangrijke ontwikkelingen
            </Heading>
            <Text type="body" className="col-span-6 mt-4">
                Ons ontwikkelteam werkt volgens de Agile methodiek, korte
                iteraties (sprints) waar na elke iteratie iets wordt opgeleverd.
                Na een aantal sprints wordt er een groter geheel opgeleverd.
                Deze grotere onderdelen hebben wij op een roadmap staan.
            </Text>
            <OntwikkelingenList>
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
            </OntwikkelingenList>
        </Container>
        <Divider />
        <Container className="pt-8 lg:pt-12">
            <Heading className="col-span-6" level="2">
                Releases
            </Heading>
            <Text type="body" className="col-span-6 mt-4">
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
        <ul className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">
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
                    className="col-span-6 py-4 underline cursor-pointer lg:col-span-5 lg:col-start-2 text-pzh-green hover:text-pzh-green-dark">
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
    items: {
        Ontwikkelingen: string[]
        Bugfixes: string[]
    }
}

const ReleaseListItem = ({
    title,
    description,
    date,
    items,
}: ReleaseListItemProps) => (
    <li className="relative col-span-6 pb-8 mt-4 border-b border-gray-300 sm:mt-8">
        <div className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">
            <div className="col-span-6 lg:col-span-1 text-pzh-gray-600">
                {date}
            </div>
            <div className="col-span-6 lg:col-span-5">
                <Heading className="mt-4 text-pzh-pink-dark lg:mt-0" level="3">
                    {title}
                </Heading>
                <Text className="mt-3" type="body">
                    {description}
                </Text>
                {Object.keys(items).map(key => (
                    <div key={key} className="mt-6">
                        <span className="inline-block font-bold">{key}</span>
                        <ul className="pl-6">
                            {items[key as keyof typeof items].map(item => (
                                <li
                                    key={item}
                                    className="pl-1 list-disc list-outside">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </li>
)

const OntwikkelingenList: FC = ({ children }) => (
    <ul className="grid grid-cols-6 col-span-6 gap-x-10 gap-y-0">{children}</ul>
)

const OntwikkelingenListItem: FC<{ title: string; icon?: JSX.Element }> = ({
    children,
    title,
    icon,
}) => (
    <li className="relative col-span-6 pl-8 mt-6 lg:col-span-3 sm:mt-8">
        <span className="absolute left-0 w-4 h-4 text-pzh-pink-dark">
            {icon ? icon : <ArrowUpRightFromSquare size={22} />}
        </span>
        <div>
            <Heading level="3" className="text-pzh-pink-dark">
                {title}
            </Heading>
            <p className="mt-2">{children}</p>
        </div>
    </li>
)

export default PlanningAndReleases
