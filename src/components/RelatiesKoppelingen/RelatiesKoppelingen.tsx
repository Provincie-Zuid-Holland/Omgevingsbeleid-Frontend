import { MouseEventHandler, useEffect, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { getValidBeleidsrelaties } from '@/api/fetchers'
import {
    BeleidsdoelenRead,
    BeleidskeuzeShortRead,
    BeleidskeuzesRead,
    BeleidsrelatiesRead,
    MaatregelenRead,
    VerordeningenRead,
} from '@/api/fetchers.schemas'
import axios from '@/api/instance'

import { LoaderSpinner } from '../Loader'
import RelatiesKoppelingenTekstueel from '../RelatiesKoppelingenTekstueel'
import RelatiesKoppelingenVisualisatie from '../RelatiesKoppelingenVisualisatie'

export type ConnectionProperties =
    | 'Belangen'
    | 'Beleidsregels'
    | 'Beleidsprestaties'
    | 'Maatregelen'
    | 'Beleidsdoelen'
    | 'Themas'
    | 'Verordeningen'

const connectionProperties: ConnectionProperties[] = [
    'Belangen',
    'Beleidsregels',
    'Beleidsprestaties',
    'Maatregelen',
    'Beleidsdoelen',
    'Themas',
    'Verordeningen',
]

export const connectionPropertiesColors = {
    MainObject: {
        hex: '#553c9a',
    },
    Belangen: {
        hex: '#D11F3D',
    },
    Beleidsregels: {
        hex: '#7BADDE',
    },
    Beleidsprestaties: {
        hex: '#76BC21',
    },
    Maatregelen: {
        hex: '#00804D',
    },
    Beleidsdoelen: {
        hex: '#FF6B02',
    },
    Themas: {
        hex: '#847062',
    },
    Verordeningen: {
        hex: '#281F6B',
    },
    Beleidskeuzes: {
        hex: '#EFCC36',
    },
}

/**
 * Displays the connections to this policy object in a visual and textual form
 *
 * @param {object} dataObject - Contains the object of which we want to display the relations
 * @param {string} titleSingular - Contains the title of this object in a singular form
 * @param {string} titleSingularPrefix - Contains the prefix of the title in singular form
 */

interface RelatiesKoppelingenProps {
    dataObject:
        | (MaatregelenRead &
              BeleidskeuzesRead &
              BeleidsdoelenRead &
              VerordeningenRead)
        | null
    titleSingular: string
    titleSingularPrefix: string
}

const RelatiesKoppelingen = ({
    dataObject,
    titleSingular,
    titleSingularPrefix,
}: RelatiesKoppelingenProps) => {
    const [beleidsRelaties, setBeleidsRelaties] = useState<
        BeleidskeuzeShortRead[]
    >([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('Visueel')

    const [verordeningsStructure, setVerordeningStructure] = useState(null)

    // As the height of the containers will vary by the content, we make sure the user can immediately see the whole container by scrolling down
    useUpdateEffect(() => {
        console.log(activeTab)
        window.scrollTo(0, document.body.scrollHeight)
    }, [activeTab])

    useEffect(() => {
        setIsLoading(true)

        /**
         * Function to get and find the first vigerende Verordening
         * @returns {Promise} Promise object contains the vigerende verordening or undefined
         */
        const getVigerendeVerordening = () =>
            axios
                .get('/verordeningstructuur')
                .then(res =>
                    res.data.find((item: any) => item.Status === 'Vigerend')
                )

        /**
         * A function to filter out relations. Filter out relations that
         * - Have a different status then 'Vigerend'
         * - Have the same UUID as the UUID on the dataObject
         *
         * @function
         *
         * @param {object[]} relations - Contains the relation objects we want to filter out
         * @param {string} type - Contains "To" or "From" indicating if the direction of the relationship
         */
        const filterOutUnvalidRelations = (
            relations: BeleidsrelatiesRead[],
            type: 'From' | 'To'
        ) => {
            const getObject = (
                relation: BeleidsrelatiesRead,
                type: 'From' | 'To'
            ) =>
                type === 'From'
                    ? relation.Naar_Beleidskeuze
                    : type === 'To'
                    ? relation.Van_Beleidskeuze
                    : null

            if (relations.length === 0) {
                return []
            } else {
                const newRelations = relations
                    .filter(relation => {
                        const relationalObj = getObject(relation, type)

                        return (
                            relationalObj?.Status === 'Vigerend' &&
                            relationalObj?.UUID !== dataObject?.UUID
                        )
                    })
                    .map(relation => getObject(relation, type))
                return newRelations
            }
        }

        /**
         * Function to get and return the beleidsrelaties specified on the Van_Beleidskeuze from an API request using the uuidFrom parameter.
         *
         * @function
         *
         * @param {string} uuidFrom - Parameter containing a UUID.
         */
        const getBeleidsrelatiesFrom = (uuidFrom: string) =>
            getValidBeleidsrelaties({
                all_filters: `Status:Akkoord,Van_Beleidskeuze:${uuidFrom}`,
            }).then(data => {
                const filteredRelations = filterOutUnvalidRelations(
                    data,
                    'From'
                ) as BeleidskeuzeShortRead[]

                return filteredRelations
            })

        /**
         * Function to get and the relations to an object
         * @returns {Promise} Promise object contains the data from the API
         *
         * @param {string} uuidTo - Parameter containing a UUID
         *
         */
        const getBeleidsrelatiesTo = (uuidTo: string) =>
            getValidBeleidsrelaties({
                all_filters: `Status:Akkoord,Naar_Beleidskeuze:${uuidTo}`,
            }).then(data => {
                const filteredRelations = filterOutUnvalidRelations(
                    data,
                    'To'
                ) as BeleidskeuzeShortRead[]

                return filteredRelations
            })

        /**
         * Function to inialize the needed data for the object of type 'Beleidskeuze'
         * Gets the relations from and to the object, and gets the active verordeningsStructure
         * When data is set in State we set the loading state to False
         */
        const initBeleidskeuze = () => {
            const beleidsrelatiesVan = getBeleidsrelatiesFrom(
                dataObject?.UUID || ''
            )
            const beleidsrelatiesNaar = getBeleidsrelatiesTo(
                dataObject?.UUID || ''
            )
            const getVerordeningsStructure = getVigerendeVerordening()

            Promise.all([
                beleidsrelatiesVan,
                beleidsrelatiesNaar,
                getVerordeningsStructure,
            ]).then(responses => {
                const relatiesVan = responses[0]
                const relatiesNaar = responses[1]
                const vigerendeVerordening = responses[2]

                setBeleidsRelaties([...relatiesVan, ...relatiesNaar])
                setVerordeningStructure(vigerendeVerordening)

                setIsLoading(false)
            })
        }

        /**
         * Function to set the intitialized data for a Beleidsobject.
         */
        const initBeleidsobject = () => {
            setBeleidsRelaties(dataObject?.Ref_Beleidskeuzes || [])
            getVigerendeVerordening().then(vigerendeVerordening => {
                setVerordeningStructure(vigerendeVerordening)
                setIsLoading(false)
            })
        }

        /**
         * Initialize the data
         */
        if (titleSingular === 'Beleidskeuze') {
            initBeleidskeuze()
        } else {
            initBeleidsobject()
        }
    }, [dataObject, titleSingular])

    return (
        <div className="w-full pb-12 bg-orange-100 md:pb-24">
            <div className="container max-w-4xl pt-8 mx-auto md:pt-16">
                <div className="px-6">
                    <h2
                        className="block mb-1 text-lg font-bold tracking-wide text-yellow-700"
                        id="raadpleeg-section-relaties-koppelingen">
                        Koppelingen & Relaties
                    </h2>
                    <p>
                        Binnen het omgevingsbeleid bestaan koppelingen en
                        relaties. Een relatie wordt aangegaan tussen
                        beleidskeuzes inclusief een duidelijke motivering en een
                        koppeling kan met alle niveaus binnen het
                        omgevingsbeleid.
                    </p>
                </div>
                <div className="p-6 mt-8 bg-white rounded-md">
                    <div className="w-full border-b">
                        <TabButton
                            activeTab={activeTab}
                            onClick={() => setActiveTab('Visueel')}
                            title="Visueel"
                        />
                        <TabButton
                            activeTab={activeTab}
                            onClick={() => setActiveTab('Tekstueel')}
                            title="Tekstueel"
                        />
                    </div>
                    <div className="mt-6">
                        {!isLoading && activeTab === 'Visueel' && dataObject ? (
                            <RelatiesKoppelingenVisualisatie
                                verordeningsStructure={verordeningsStructure}
                                titleSingular={titleSingular}
                                titleSingularPrefix={titleSingularPrefix}
                                beleidsObject={dataObject}
                                beleidsRelaties={beleidsRelaties}
                                connectionProperties={connectionProperties}
                                connectionPropertiesColors={
                                    connectionPropertiesColors
                                }
                            />
                        ) : !isLoading &&
                          activeTab === 'Tekstueel' &&
                          dataObject ? (
                            <RelatiesKoppelingenTekstueel
                                verordeningsStructure={verordeningsStructure}
                                beleidsObject={dataObject}
                                beleidsRelaties={beleidsRelaties}
                                connectionProperties={connectionProperties}
                                connectionPropertiesColors={
                                    connectionPropertiesColors
                                }
                            />
                        ) : isLoading ? (
                            <div className="flex items-center justify-center w-full p-24 text-gray-500">
                                <LoaderSpinner />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Displays a tab button which the user can click to switch tabs.
 *
 * @param {string} activeTab - Contains the title of the active tab
 * @param {function} onClick - Function to switch the active tab
 * @param {string} title - The title of the tab
 */

interface TabButtonProps {
    activeTab: string
    onClick: MouseEventHandler<HTMLButtonElement>
    title: string
}

const TabButton = ({ activeTab, onClick, title }: TabButtonProps) => (
    <button
        className={`border-opacity-0 transition duration-100 ease-in border-b-2 border-pzh-blue px-5 py-2 font-bold text-pzh-blue ${
            activeTab === title
                ? 'border-opacity-100'
                : 'hover:border-opacity-25 focus:border-opacity-50'
        }`}
        onClick={onClick}>
        {title}
    </button>
)

export default RelatiesKoppelingen
