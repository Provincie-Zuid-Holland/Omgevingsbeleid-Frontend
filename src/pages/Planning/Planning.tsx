import { faCheck } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'

import ButtonBackToPage from '@/components/ButtonBackToPage'

/**
 * Component to display the planning
 */
const Planning = () => (
    <>
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
                        title="Beta versie online zetten"
                        content="We hebben de “oude” omgeving vervangen met de nieuwe lay-out, maar ook technisch is het een stuk verbeterd."
                        completed
                    />

                    <ListItem
                        title="Maatregelen toevoegen"
                        content="Per 7 augustus 2021 heeft de provincie één Omgevingsprogramma om te voldoen aan de Omgevingswet. Het Omgevingsprogramma bestaat uit maatregelen die aangeven hoe de beleidskeuzes uit de Omgevingsvisie uitgevoerd gaan worden. De maatregelen zijn allemaal toegevoegd aan het systeem."
                        completed
                    />

                    <ListItem
                        title="Huisstijl provincie"
                        content="In samenwerking met de afdeling communicatie zorgen we dat het systeem blijft aansluiten op de huisstijl van de provincie. Zo blijft het herkenbaar voor iedereen!"
                        completed
                    />

                    <ListItem
                        title="Revisieoverzicht"
                        content="Met het revisieoverzicht kunnen oude versies van beleid vergeleken worden met de huidige versies. Zo wordt duidelijk wat in de loop der tijd gewijzigd is."
                        completed
                    />

                    <ListItem
                        title="Netwerkvisualisatie (Beta)"
                        content="Een visuele presentatie van de koppelingen en relaties van het beleid en de regelgeving. Zo is al het provinciale Omgevingsbeleid in één oogopslag zichtbaar en wordt inzichtelijk welke onderwerpen met elkaar te maken hebben."
                        completed
                    />

                    <ListItem
                        title="Open Source"
                        content="De code en logica van het 'Digitaal Omgevingsbeleid' zijn openbaar, het project is dus open source. We zorgen voor de juiste basis, een passende licentie en andere belangrijke stappen zodat de code 'open source' kan worden. Op die manier kunnen derden de code ook benutten. Benieuwd naar de mogelijkheden voor jouw gemeente of provincie? Neem contact op via omgevingsbeleid@pzh.nl"
                        completed
                    />

                    <ListItem
                        title="Vindbaarheid verbeteren"
                        content="Als gebruiker wil je (tekstueel) kunnen zoeken binnen het Omgevingsbeleid van de provincie Zuid-Holland. Dit onderdeel gaat over het beter vindbaar maken van de informatie in de database, dus ook al komt een zoekterm maar 1x voor in een stuk tekst, moet hij worden getoond. Daarnaast wordt er bij dit onderdeel nagedacht over de volgorde van het presenteren van de zoekresultaten."
                        completed
                    />

                    <ListItem
                        title="Annoteren van de Omgevingsverordening"
                        content="Het landelijk Omgevingsloket biedt de mogelijkheid om extra informatie te binden aan beleidsteksten en regels. Dit willen we mogelijk maken voor de Omgevingsverordening zodat duidelijk wordt wat een bepaald woord betekent, welke normen eraan verbonden zijn of met welk thema het verbonden is."
                        completed
                    />

                    <ListItem
                        title="Digitoegankelijkheid"
                        content="We lopen alles regelmatig na om uit te zoeken of het systeem voor alle gebruikers goed te gebruiken is. Natuurlijk kijken we daarbij naar de landelijke standaard die daarvoor beschikbaar is."
                        completed
                    />

                    <ListItem
                        title="Zoeken op de kaart"
                        content="Het is handig om het Omgevingsbeleid op een kaart te kunnen zien op een specifiek punt of gebied. Daarom gaan we aan de slag met het zoeken op de kaart. Hiermee kun je een gebied tekenen of een punt op de kaart zetten om te zoeken, en daarna de resultaten visueel gepresenteerd krijgen."
                        completed
                    />
                </ul>
            </div>
        </div>
    </>
)

interface ListItemProps {
    title: string
    content: string
    completed: boolean
}

const ListItem = ({ title, content, completed }: ListItemProps) => {
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
