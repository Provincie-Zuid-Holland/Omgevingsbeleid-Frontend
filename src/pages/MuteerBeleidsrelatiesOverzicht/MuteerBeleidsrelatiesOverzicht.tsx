import {
    faAngleRight,
    faHourglass,
    faCheck,
    faEnvelope,
    faTimes,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { BeleidskeuzesRead, BeleidsrelatiesRead } from '@/api/fetchers.schemas'
import { LoaderBeleidsrelatieRegel } from '@/components/Loader'
import SidebarMain from '@/components/SidebarMain'

type BeleidsKeuzeObject = {
    Titel: string | undefined
    Status: string | undefined
    UUID: string | undefined
    Bevestigd: number
    Onbevestigd: number
    Afgewezen: number
    Verzoeken: number
    RelatieArray: BeleidsrelatiesRead[]
    VerzoekArray: BeleidsrelatiesRead[]
}

interface MuteerBeleidsrelatiesOverzichtProps {
    beleidsrelaties: BeleidsrelatiesRead[]
    beleidskeuzes: BeleidskeuzesRead[]
    parentDataLoaded?: boolean
    currentView?: string
    setCurrentView: (view: string) => void
}

const MuteerBeleidsrelatiesOverzicht = ({
    beleidsrelaties: providedBeleidsrelaties,
    beleidskeuzes,
    parentDataLoaded,
    setCurrentView,
}: MuteerBeleidsrelatiesOverzichtProps) => {
    const [dataLoaded, setDataLoaded] = useState(false)
    const [beleidskeuzesObject, setBeleidskeuzesObject] = useState<
        BeleidsKeuzeObject[] | null
    >(null)

    // Als de gebruiker de url veranderd, verander naar de 'overzicht' over de 'detail' view
    useEffect(() => {
        if (parentDataLoaded) {
            initializeState()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentDataLoaded])

    // Kijkt hoeveel bevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    const countBevestigdeRelaties = (UUID?: string) => {
        const beleidsrelaties = providedBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    const countOnbevestigdeRelaties = (UUID?: string) => {
        const beleidsrelaties = providedBeleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                beleidsrelatie.Status === 'Open'
        )

        return beleidsrelaties.length
    }

    // Kijkt hoeveel onbevestigde relaties er in het beleidsrelatie object zitten met de geleverde UUID
    const countVerzoekRelaties = (UUID?: string) => {
        const beleidsrelaties = providedBeleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                beleidsrelatie.Status === 'Open'
        )
        return beleidsrelaties.length
    }

    // Kijkt hoeveel afgewezen relaties er in het beleidsrelatie object zitten met de geleverde UUID
    const countAfgewezenRelaties = (UUID?: string) => {
        const beleidsrelaties = providedBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )
        return beleidsrelaties.length
    }

    // For each beleidskeuze we create an object containing meta info
    const initializeBeleidskeuzes = (beleidskeuzes: BeleidskeuzesRead[]) => {
        return beleidskeuzes.map(item => ({
            Titel: item.Titel,
            Status: item.Status,
            UUID: item.UUID,
            Bevestigd: countBevestigdeRelaties(item.UUID),
            Onbevestigd: countOnbevestigdeRelaties(item.UUID),
            Afgewezen: countAfgewezenRelaties(item.UUID),
            Verzoeken: countVerzoekRelaties(item.UUID),
            RelatieArray: generateRelatieArray(item.UUID),
            VerzoekArray: generateVerzoekArray(item.UUID),
        }))
    }

    // Na het ophalen van de data in de API, Initialize de state
    // Map over alle beleidskeuzes en return een array met voor elke beleidskeuze een object met:
    // Titel, Status, het aantal Bevestigde, het aantal Onbevestigde, UUID
    const initializeState = () => {
        setBeleidskeuzesObject(initializeBeleidskeuzes(beleidskeuzes))
        setDataLoaded(true)
    }

    // Maak de array waar de relatie objecten van de desbetreffende beleidskeuze in zitten
    // Voor elke relatie halen we ook de beleidskeuze op, zodat we in het detail scherm info zoals de titel kunnen tonen
    const generateRelatieArray = (UUID?: string) => {
        // We filteren op basis van de gekregen beleidskeuze UUID parameter
        // We spreken van een beleidsrelatie als de UUID overeenkomt met Van_Beleidskeuze of Naar_Beleidskeuze
        // EN als de beleidsrelatie een Status heeft van 'Akkoord' of 'Open'
        return providedBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID) &&
                beleidsrelatie.Status === 'Akkoord'
        )
    }

    // Maak de array waar de verzoek objecten van de desbetreffende beleidskeuze in zitten
    // Voor elk verzoek halen we ook de beleidskeuze op, zodat we in het detail scherm info zoals de titel kunnen tonen
    const generateVerzoekArray = (UUID?: string) => {
        // We filteren op basis van de gekregen beleidskeuze UUID parameter
        // We spreken van een verzoek als de UUID overeenkomt met Naar_Beleidskeuze
        // EN als de beleidsrelatie een Status heeft van 'Open'
        return providedBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'Open') ||
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'Open')
        )
    }

    // Sort object
    const sortedBeleidskeuzesObject =
        beleidskeuzesObject?.sort((a, b) =>
            (a.Titel || '') > (b.Titel || '') ? 1 : -1
        ) || []

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Beleidsrelaties</title>
            </Helmet>
            <SidebarMain />
            <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                <h2 className="mb-4 text-gray-800">Beleidsrelaties</h2>
                <div className="p-5 bg-white rounded shadow">
                    <ul id="beleidskeuzes-overview">
                        <li className="flex py-2 text-sm font-bold text-gray-800 border-b border-gray-200">
                            <div className="w-6/12 pl-10">Beleidskeuzes</div>
                            <div className="w-2/12">Status</div>
                            <div className="w-1/12 text-center">
                                <FontAwesomeIcon
                                    title="Geaccepteerde beleidsrelatie"
                                    className="text-gray-800 "
                                    icon={faCheck}
                                />
                            </div>
                            <div className="w-1/12 text-center">
                                <FontAwesomeIcon
                                    title="Een onbevestigde relatie, is een relatie die door de andere partij nog geaccepteerd moet worden"
                                    className="text-gray-800 "
                                    icon={faHourglass}
                                />
                            </div>
                            <div className="w-1/12 text-center">
                                <FontAwesomeIcon
                                    title="Inkomend verzoek"
                                    className="text-gray-800 "
                                    icon={faEnvelope}
                                />
                            </div>
                            <div className="w-1/12 mr-6 text-center ">
                                <FontAwesomeIcon
                                    title="Afgewezen relaties"
                                    className="text-gray-800 "
                                    icon={faTimes}
                                />
                            </div>
                        </li>
                        {dataLoaded && beleidskeuzesObject ? (
                            sortedBeleidskeuzesObject.length !== 0 ? (
                                sortedBeleidskeuzesObject.map(item => (
                                    <li
                                        key={item.UUID}
                                        className="beleids-item">
                                        <Link
                                            className="relative flex items-center py-1 text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-100"
                                            to={`/muteer/beleidsrelaties/${item.UUID}`}
                                            onClick={() =>
                                                setCurrentView('detail')
                                            }>
                                            <span className="absolute inline-block w-3 h-3 ml-3 rounded-full bg-pzh-blue"></span>
                                            <div
                                                className="w-6/12 pl-10"
                                                data-testid="title">
                                                {item.Titel}
                                            </div>
                                            <div className="w-2/12">
                                                <span
                                                    className={`inline-block px-1 py-1 text-xs leading-8 ${
                                                        item.Status ===
                                                        'Vigerend'
                                                            ? 'text-pzh-blue'
                                                            : 'text-pzh-yellow-dark'
                                                    } 
                                                                    `}>
                                                    {item.Status}
                                                </span>
                                            </div>
                                            <div className="w-1/12 text-center">
                                                {item.Bevestigd !== 0
                                                    ? item.Bevestigd
                                                    : '-'}
                                            </div>
                                            <div className="w-1/12 text-center">
                                                {item.Onbevestigd !== 0
                                                    ? item.Onbevestigd
                                                    : '-'}
                                            </div>
                                            <div
                                                className="w-1/12 text-center"
                                                data-testid="incoming">
                                                {item.Verzoeken !== 0
                                                    ? item.Verzoeken
                                                    : '-'}
                                            </div>
                                            <div className="w-1/12 mr-6 text-center ">
                                                {item.Afgewezen !== 0
                                                    ? item.Afgewezen
                                                    : '-'}
                                            </div>
                                            <FontAwesomeIcon
                                                className="absolute right-0 h-8 mr-3 text-gray-700"
                                                icon={faAngleRight}
                                            />
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="inline-block mt-2 text-gray-600 font-italic">
                                    Je hebt nog geen beleidskeuzes
                                </li>
                            )
                        ) : (
                            <li>
                                <LoaderBeleidsrelatieRegel />
                                <LoaderBeleidsrelatieRegel />
                                <LoaderBeleidsrelatieRegel />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default MuteerBeleidsrelatiesOverzicht
