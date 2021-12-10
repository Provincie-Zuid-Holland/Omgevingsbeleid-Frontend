import React from "react"

import LoaderSpinner from "../LoaderSpinner"

import RelatiesKoppelingenVisualisatie from "../RelatiesKoppelingenVisualisatie"
import RelatiesKoppelingenTekstueel from "../RelatiesKoppelingenTekstueel"
import axios from "./../../API/axios"

const connectionProperties = [
    "Ambities",
    "Belangen",
    "Beleidsregels",
    "Beleidsprestaties",
    "Maatregelen",
    "Beleidsdoelen",
    "Themas",
    "Verordeningen",
]

const connectionPropertiesColors = {
    MainObject: {
        hex: "#553c9a",
    },
    Ambities: {
        hex: "#AA0067",
    },
    Belangen: {
        hex: "#D11F3D",
    },
    Beleidsregels: {
        hex: "#7BADDE",
    },
    Beleidsprestaties: {
        hex: "#76BC21",
    },
    Maatregelen: {
        hex: "#00804D",
    },
    Beleidsdoelen: {
        hex: "#FF6B02",
    },
    Themas: {
        hex: "#847062",
    },
    Verordeningen: {
        hex: "#281F6B",
    },
    Beleidskeuzes: {
        hex: "#EFCC36",
    },
}

/**
 *
 * @param {object} props
 * @param {object} dataObject - Contains the object of which we want to display the relations
 * @param {string} titleSingular - Contains the title of this object in a singular form
 * @param {string} titleSingularPrefix - Contains the prefix of the title (de/het)
 * @returns A component containing two tabs containing a visual and a textual child component that displays the connections to the dataObject
 */
const RelatiesKoppelingen = ({
    dataObject,
    titleSingular,
    titleSingularPrefix,
}) => {
    const [beleidsRelaties, setBeleidsRelaties] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState("Visueel")

    const [verordeningsStructure, setVerordeningStructure] =
        React.useState(null)

    // As the height of the containers will vary by the content, we make sure the user can immediately see the whole container by scrolling down
    React.useEffect(
        () => window.scrollTo(0, document.body.scrollHeight),
        [activeTab]
    )

    React.useEffect(() => {
        setIsLoading(true)

        /**
         * Function to get and find the first vigerende Verordening
         * @returns {Promise} Promise object contains the vigerende verordening or undefined
         */
        const getVigerendeVerordening = () =>
            axios
                .get("/verordeningstructuur")
                .then((res) =>
                    res.data.find((item) => item.Status === "Vigerend")
                )

        /**
         * A function to filter out relations. Filter out relations that
         * - Have a different status then 'Vigerend'
         * - Have the same UUID as the UUID on the dataObject
         * @param {object[]} relations - Contains the relation objects we want to filter out
         */
        const filterOutUnvalidRelations = (relations) => {
            if (relations.length === 0) {
                return relations
            } else if (relations[0].hasOwnProperty("Van_Beleidskeuze")) {
                return relations.filter(
                    (relation) =>
                        relation.Van_Beleidskeuze.Status === "Vigerend" &&
                        relation.Van_Beleidskeuze.UUID !== dataObject.UUID
                )
            } else if (relations[0].hasOwnProperty("Naar_Beleidskeuze")) {
                return relations.filter(
                    (relation) =>
                        relation.Naar_Beleidskeuze.Status === "Vigerend" &&
                        relation.Naar_Beleidskeuze.UUID !== dataObject.UUID
                )
            } else {
                return []
            }
        }

        /**
         * Function to get and the relations from an object
         * @returns {Promise} Promise object contains the data from the API
         */
        const getBeleidsrelatiesFrom = (uuidFrom) =>
            axios
                .get(
                    `/valid/beleidsrelaties?all_filters=Status:Akkoord,Van_Beleidskeuze:${uuidFrom}`
                )
                .then((res) => {
                    const filteredRelations = filterOutUnvalidRelations(
                        res.data
                    )

                    return filteredRelations
                })

        /**
         * Function to get and the relations to an object
         * @returns {Promise} Promise object contains the data from the API
         */
        const getBeleidsrelatiesTo = (uuidTo) =>
            axios
                .get(
                    `/valid/beleidsrelaties?all_filters=Status:Akkoord,Naar_Beleidskeuze:${uuidTo}`
                )
                .then((res) => {
                    const filteredRelations = filterOutUnvalidRelations(
                        res.data
                    )

                    return filteredRelations
                })

        /**
         * Function to inialize the needed data for the object of type 'Beleidskeuze'
         * Gets the relations from and to the object, and gets the active verordeningsStructure
         * When data is set in State we set the loading state to False
         */
        const initBeleidskeuze = () => {
            const beleidsrelatiesVan = getBeleidsrelatiesFrom(dataObject.UUID)
            const beleidsrelatiesNaar = getBeleidsrelatiesTo(dataObject.UUID)
            const getVerordeningsStructure = getVigerendeVerordening()

            Promise.all([
                beleidsrelatiesVan,
                beleidsrelatiesNaar,
                getVerordeningsStructure,
            ]).then((responses) => {
                const relatiesVan = responses[0]
                const relatiesNaar = responses[1]
                const vigerendeVerordening = responses[2]

                setBeleidsRelaties([...relatiesVan, ...relatiesNaar])
                setVerordeningStructure(vigerendeVerordening)

                setIsLoading(false)
            })
        }

        /**
         * Function to inialize the needed data for objects that are NOT of type 'Beleidskeuze'
         * Sets the relations to beleidskeuzes in state, and gets the active verordeningsStructure
         * When data is set in State we set the loading state to False
         */
        const initBeleidsobject = () => {
            setBeleidsRelaties(dataObject.Ref_Beleidskeuzes)
            getVigerendeVerordening().then((vigerendeVerordening) => {
                setVerordeningStructure(vigerendeVerordening)
                setIsLoading(false)
            })
        }

        /**
         * Initialize the data
         */
        if (titleSingular === "Beleidskeuze") {
            initBeleidskeuze()
        } else {
            initBeleidsobject()
        }
    }, [dataObject.UUID, titleSingular, dataObject.Ref_Beleidskeuzes])

    return (
        <div className="w-full pb-24 bg-orange-100">
            <div className="container max-w-4xl pt-16 mx-auto">
                <div className="px-6">
                    <h2
                        className="block mb-1 text-lg font-bold tracking-wide text-yellow-700"
                        id="raadpleeg-section-relaties-koppelingen"
                    >
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
                            onClick={() => setActiveTab("Visueel")}
                            title="Visueel"
                        />
                        <TabButton
                            activeTab={activeTab}
                            onClick={() => setActiveTab("Tekstueel")}
                            title="Tekstueel"
                        />
                    </div>
                    <div className="mt-6">
                        {!isLoading && activeTab === "Visueel" ? (
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
                        ) : !isLoading && activeTab === "Tekstueel" ? (
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
 *
 * @param {object} props
 * @param {string} activeTab - Contains the currently active tab
 * @param {function} onClick - Function to switch the active tab
 * @param {string} title - The title of the tab
 * @returns A component that renders a tab button
 */
const TabButton = ({ activeTab, onClick, title }) => {
    return (
        <button
            className={`border-opacity-0 transition duration-100 ease-in border-b-2 border-pzh-blue px-5 py-2 font-bold text-pzh-blue ${
                activeTab === title
                    ? "border-opacity-100"
                    : "hover:border-opacity-25 focus:border-opacity-50"
            }`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default RelatiesKoppelingen
