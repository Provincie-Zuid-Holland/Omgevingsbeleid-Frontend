import React from 'react'

import LoaderSpinner from '../LoaderSpinner'

import RelatiesKoppelingenVisualisatie from '../RelatiesKoppelingenVisualisatie'
import RelatiesKoppelingenTekstueel from '../RelatiesKoppelingenTekstueel'
import axios from './../../API/axios'

const connectionProperties = [
    'Ambities',
    'Belangen',
    'Beleidsregels',
    'Beleidsprestaties',
    'Maatregelen',
    'Beleidsdoelen',
    'Themas',
    'Verordening',
]

const connectionPropertiesColors = {
    MainObject: {
        hex: '#553c9a',
    },
    Ambities: {
        hex: '#aa0067',
    },
    Belangen: {
        hex: '#ff6b02',
    },
    Beleidsregels: {
        hex: '#76bc21',
    },
    Beleidsprestaties: {
        hex: '#ECC94B',
    },
    Maatregelen: {
        hex: '#503d90',
    },
    Beleidsdoelen: {
        hex: '#3182CE',
    },
    Themas: {
        hex: '#847062',
    },
    Verordening: {
        hex: '#eb7085',
    },
    Beleidskeuzes: {
        hex: '#7badde',
    },
}

const RelatiesKoppelingen = ({
    dataObject,
    titleSingular,
    titleSingularPrefix,
}) => {
    const [beleidsRelaties, setBeleidsRelaties] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState('Visueel')

    // As the height of the containers will vary by the content, we make sure the user can immediately see the whole container by scrolling down
    React.useEffect(() => window.scrollTo(0, document.body.scrollHeight), [
        activeTab,
    ])

    const initBeleidskeuze = () => {
        const beleidsrelatiesVan = axios
            .get(
                `/beleidsrelaties?all_filters=Status:Akkoord,Van_Beleidskeuze:${dataObject.UUID}`
            )
            .then((res) => res.data)

        const beleidsrelatiesNaar = axios
            .get(
                `/beleidsrelaties?all_filters=Status:Akkoord,Naar_Beleidskeuze:${dataObject.UUID}`
            )
            .then((res) => res.data)

        Promise.all([beleidsrelatiesVan, beleidsrelatiesNaar]).then(
            (relaties) => {
                // Generate UUID's of all the beleidskeuzes that this beleidskeuze has a relationship with
                const relatiesVan = relaties[0]
                const relatiesNaar = relaties[1]

                setBeleidsRelaties([...relatiesVan, ...relatiesNaar])
                setIsLoading(false)
            }
        )
    }

    const initBeleidsobject = () => {
        setBeleidsRelaties(dataObject.Ref_Beleidskeuzes)
        setIsLoading(false)
    }

    React.useEffect(() => {
        if (titleSingular === 'Beleidskeuze') {
            initBeleidskeuze()
        } else {
            initBeleidsobject()
        }
    }, [dataObject.UUID])

    return (
        <div className="w-full pb-24 bg-orange-100">
            <div className="container max-w-4xl pt-16 mx-auto">
                <div className="px-6">
                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-yellow-700">
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
                        {!isLoading && activeTab === 'Visueel' ? (
                            <RelatiesKoppelingenVisualisatie
                                titleSingular={titleSingular}
                                titleSingularPrefix={titleSingularPrefix}
                                beleidsObject={dataObject}
                                beleidsRelaties={beleidsRelaties}
                                connectionProperties={connectionProperties}
                                connectionPropertiesColors={
                                    connectionPropertiesColors
                                }
                            />
                        ) : !isLoading && activeTab === 'Tekstueel' ? (
                            <RelatiesKoppelingenTekstueel
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

const TabButton = ({ activeTab, onClick, title }) => {
    return (
        <button
            className={`border-opacity-0 transition duration-100 ease-in border-b-2 border-pzh-blue px-5 py-2 font-bold text-pzh-blue ${
                activeTab === title
                    ? 'border-opacity-100'
                    : 'hover:border-opacity-25 focus:border-opacity-50'
            }`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default RelatiesKoppelingen
