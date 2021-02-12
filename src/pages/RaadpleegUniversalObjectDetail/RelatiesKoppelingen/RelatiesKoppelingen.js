import React from 'react'

import LoaderSpinner from './../../../components/LoaderSpinner'

import RelatiesKoppelingenVisualisatie from './../RelatiesKoppelingenVisualisatie'
import RelatiesKoppelingenTekstueel from './../RelatiesKoppelingenTekstueel'
import axios from '../../../API/axios'

const connectionProperties = [
    'Ambities',
    'Belangen',
    'BeleidsRegels',
    'Doelen',
    'Maatregelen',
    'Opgaven',
    'Themas',
    'Verordening',
]

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
const connectionPropertiesColors = {
    Ambities: {
        hex: '#ED8936',
        class: 'orange-500',
    },
    Belangen: {
        hex: '#D53F8C',
        class: 'pink-600',
    },
    BeleidsRegels: {
        hex: '#718096',
        class: 'gray-600',
    },
    Doelen: {
        hex: '#ECC94B',
        class: 'yellow-500',
    },
    Maatregelen: {
        hex: '#48BB78',
        class: 'green-500',
    },
    Opgaven: {
        hex: '#3182CE',
        class: 'blue-600',
    },
    Themas: {
        hex: '#38B2AC',
        class: 'teal-500',
    },
    Verordening: {
        hex: '#E53E3E',
        class: 'red-600',
    },
    Beleidskeuzes: {
        hex: '#805AD5',
        class: 'purple-600',
    },
}

const RelatiesKoppelingen = ({ beleidskeuze }) => {
    const [beleidsRelaties, setBeleidsRelaties] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState('Visueel')

    // As the height of the containers will vary by the content, we make sure the user can immediately see the whole container by scrolling down
    React.useEffect(() => window.scrollTo(0, document.body.scrollHeight), [
        activeTab,
    ])

    React.useEffect(() => {
        const beleidsrelatiesVan = axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${beleidskeuze.UUID}`)
            .then((res) => res.data)
        const beleidsrelatiesNaar = axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${beleidskeuze.UUID}`)
            .then((res) => res.data)

        Promise.all([beleidsrelatiesVan, beleidsrelatiesNaar])
            .then((relaties) => {
                // Generate UUID's of all the beleidskeuzes that this beleidskeuze has a relationship with
                const relatiesVan = relaties[0]
                const relatiesNaar = relaties[1]

                const relatiesVanUUIDS = relatiesVan.map(
                    (relatie) => relatie.Naar_Beleidsbeslissing
                )
                const relatiesNaarUUIDS = relatiesNaar.map(
                    (relatie) => relatie.Van_Beleidsbeslissing
                )
                const relatieUUIDS = [...relatiesVanUUIDS, ...relatiesNaarUUIDS]

                return relatieUUIDS
            })
            .then((relatieUUIDS) => {
                // Get data from API and set in state
                const getAllRelatieBeleidskeuzes = relatieUUIDS.map((UUID) =>
                    axios
                        .get(`/beleidsbeslissingen/version/${UUID}`)
                        .then((res) => res.data)
                )
                Promise.all(getAllRelatieBeleidskeuzes).then((relaties) => {
                    setBeleidsRelaties(relaties)
                    setIsLoading(false)
                })
            })
    }, [beleidskeuze.UUID])

    return (
        <div className="w-full pb-24 bg-orange-100">
            <div className="container max-w-4xl pt-16 mx-auto">
                <div className="px-6">
                    <h2 className="block mb-1 text-lg font-semibold tracking-wide text-yellow-700">
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
                                beleidskeuze={beleidskeuze}
                                beleidsRelaties={beleidsRelaties}
                                connectionProperties={connectionProperties}
                                connectionPropertiesColors={
                                    connectionPropertiesColors
                                }
                            />
                        ) : !isLoading && activeTab === 'Tekstueel' ? (
                            <RelatiesKoppelingenTekstueel
                                beleidskeuze={beleidskeuze}
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
            className={`border-opacity-0 transition duration-100 ease-in border-b-2 border-primary-super-dark px-5 py-2 font-bold text-primary-super-dark ${
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
