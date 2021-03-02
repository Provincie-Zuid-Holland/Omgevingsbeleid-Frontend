import React from 'react'
import { Helmet } from 'react-helmet'

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ButtonBackToPage from './../../components/ButtonBackToPage'

/**
 * Component to display the planning
 */
const Planning = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Planning - Omgevingsbeleid Provincie Zuid-Holland</title>
                <meta
                    property="og:title"
                    content="Planning - Omgevingsbeleid Provincie Zuid-Holland"
                />
                <meta
                    property="og:description"
                    content="De website over het digitaal omgevingsbeleid van de Provincie Zuid-Holland is continu in ontwikkeling, op deze pagina delen we graag waar we mee bezig zijn en wat we hebben afgerond."
                />
            </Helmet>
            <div className="container mx-auto sm:px-6 lg:px-8">
                <ButtonBackToPage terugNaar="startpagina" url="/" />
            </div>
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="mt-8 text-2xl font-bold text-pzh-blue">
                        Wat staat er op onze planning?
                    </h1>
                    <ul className="pb-8 mt-10 mb-24">
                        <ListItem
                            title="Beta versie online zetten (6 april 2020)"
                            content="We hebben de “oude” omgeving vervangen met de nieuwe
                    lay-out, maar ook technisch is het een stuk verbeterd."
                            completed={true}
                        />
                        <ListItem
                            title="Inhoudelijk"
                            content="Op inhoudelijk vlak worden diverse stappen genomen, denk hierbij aan het omzetten van de programma’s naar één omgevingsprogramma. De maatregelen uit het omgevingsprogramma vormen daarna diverse uitvoeringprogramma’s. Maar ook de sturing en omgevingskwaliteit krijgen een plek in dit systeem."
                            completed={false}
                        />
                        <ListItem
                            title="Zoeken op de kaart"
                            content="Het is wel zo handig om de verordening en visie op een kaart te kunnen zien, zeker op een specifiek punt of gebied. Daarom gaan we aan de slag met het zoeken op de kaart. Hiermee kun je een gebied tekenen of een punt op de kaart zetten om te zoeken, en daarna de resultaten visueel gepresenteerd krijgen."
                            completed={false}
                        />
                        <ListItem
                            title="Netwerkvisualisatie"
                            content="Een visuele presentatie van de koppelingen en relaties van het beleid en de verordening. Zo wordt de samenhang tussen de ambitie’s, opgaven en beleidskeuze’s inzichtelijk."
                            completed={false}
                        />
                        <ListItem
                            title="Digitoegankelijkheid"
                            content="We lopen alles regelmatig na om uit te zoeken of het systeem voor alle gebruikers goed te gebruiken is. Natuurlijk kijken we daarbij naar de landelijke standaard die daarvoor beschikbaar is."
                            completed={false}
                        />
                        <ListItem
                            title="Revisieoverzicht"
                            content="Het vergelijken van twee verschillende versies."
                            completed={false}
                        />
                        <ListItem
                            title="Huisstijl provincie (planning 2021 Q1)"
                            content="In samenwerking met communicatie zorgen we dat het systeem blijft aansluiten op de huisstijl van de provincie. Zo blijft het herkenbaar voor iedereen, maar zijn we wel vrij om e.e.a. aan te passen."
                            completed={false}
                        />
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}

const ListItem = ({ title, content, completed }) => {
    return (
        <li className="flex mb-10">
            <div className="w-8">
                {completed ? (
                    <FontAwesomeIcon
                        className="relative mt-1 text-lg text-pzh-green"
                        icon={faCheck}
                    />
                ) : (
                    <span className="relative inline-block w-4 h-4 mt-1 bg-white border border-gray-600 rounded" />
                )}
            </div>
            <div className="w-full">
                <span className="text-2xl font-bold text-pzh-blue">
                    {title}
                </span>
                <p className="mt-2">{content}</p>
            </div>
        </li>
    )
}

export default Planning
