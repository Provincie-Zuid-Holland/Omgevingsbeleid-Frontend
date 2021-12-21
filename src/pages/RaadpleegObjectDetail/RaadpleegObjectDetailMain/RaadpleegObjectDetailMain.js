import React from "react"

import ContainerViewFieldsBeleidsprestatie from "./../ContainerFields/ContainerViewFieldsBeleidsprestatie"
import ContainerViewFieldsBeleidsdoelen from "./../ContainerFields/ContainerViewFieldsBeleidsdoelen"
import ContainerViewFieldsBeleidskeuze from "./../ContainerFields/ContainerViewFieldsBeleidskeuze"
import ContainerViewFieldsBeleidsregel from "./../ContainerFields/ContainerViewFieldsBeleidsregel"
import ContainerViewFieldsMaatregel from "./../ContainerFields/ContainerViewFieldsMaatregel"
import ContainerViewFieldsAmbitie from "./../ContainerFields/ContainerViewFieldsAmbitie"
import ContainerViewFieldsBelang from "./../ContainerFields/ContainerViewFieldsBelang"
import ContainerViewFieldsThema from "./../ContainerFields/ContainerViewFieldsThema"

import Heading from "../../../components/Heading"

import RaadpleegObjectDetailNewVersionNotification from "./../RaadpleegObjectDetailNewVersionNotification"
import ViewFieldGebiedDuiding from "./../ViewFieldGebiedDuiding"
import Werkingsgebied from "./../Werkingsgebied"

const RaadpleegObjectDetailMain = ({
    dataLoaded,
    dataObject,
    titleSingular,
}) => {
    // Boolean to toggle the large view
    const [fullscreenLeafletViewer, setFullscreenLeafletViewer] =
        React.useState(false)

    // Returns boolean
    // There are two objects with werkingsgebieden:
    // - Maatregelen
    // - Beleidskeuzes
    const checkIfObjectHasWerkingsgebied = () => {
        if (!dataLoaded || !dataObject) return false

        // Check if there is a werkingsgebied
        if (
            dataObject.Gebied ||
            (dataObject.Werkingsgebieden && dataObject.Werkingsgebieden[0])
        ) {
            return true
        } else {
            return false
        }
    }

    const getWerkingsgbiedUUID = (hasWerkingsGebied) => {
        if (!hasWerkingsGebied) return null

        if (dataObject.Gebied) {
            // Object is a maatregel, which contains the UUID in a string value
            return dataObject.Gebied.UUID
        } else if (
            dataObject.Werkingsgebieden &&
            dataObject.Werkingsgebieden[0]
        ) {
            // Object is a beleidskeuze/beleidskeuze, which holds the werkingsgebieden in an array.
            // We always need the first value in the array
            return dataObject.Werkingsgebieden[0].Object.UUID
        }
    }

    const hasWerkingsGebied = checkIfObjectHasWerkingsgebied()
    const werkingsGebiedUUID = getWerkingsgbiedUUID(hasWerkingsGebied)

    return (
        <main className="col-span-6 lg:mt-8 lg:col-span-4">
            <div>
                <Heading
                    level="3"
                    className="font-bold"
                    color="text-pzh-blue-dark"
                >
                    {titleSingular}
                </Heading>
                <RaadpleegObjectDetailNewVersionNotification
                    dataObject={dataObject}
                />
                <Heading level="1" color="text-pzh-blue" className="mt-4">
                    {dataObject ? dataObject.Titel : null}
                </Heading>
            </div>
            {/* These contain the fields that need to be displayed for the different objects */}
            <div
                className={`mt-4 ${
                    titleSingular === "Beleidskeuze" ? "" : "pb-20"
                }`}
                id="raadpleeg-detail-container-main"
            >
                {titleSingular === "Beleidskeuze" ? (
                    <ContainerViewFieldsBeleidskeuze crudObject={dataObject} />
                ) : titleSingular === "Beleidsregel" ? (
                    <ContainerViewFieldsBeleidsregel crudObject={dataObject} />
                ) : titleSingular === "Beleidsprestatie" ? (
                    <ContainerViewFieldsBeleidsprestatie
                        crudObject={dataObject}
                    />
                ) : titleSingular === "Maatregel" ? (
                    <ContainerViewFieldsMaatregel crudObject={dataObject} />
                ) : titleSingular === "Beleidsdoel" ? (
                    <ContainerViewFieldsBeleidsdoelen crudObject={dataObject} />
                ) : titleSingular === "Ambitie" ? (
                    <ContainerViewFieldsAmbitie crudObject={dataObject} />
                ) : titleSingular === "Belang" ? (
                    <ContainerViewFieldsBelang crudObject={dataObject} />
                ) : titleSingular === "Thema" ? (
                    <ContainerViewFieldsThema crudObject={dataObject} />
                ) : null}
            </div>
            {hasWerkingsGebied && dataLoaded ? (
                <Werkingsgebied
                    fullscreenLeafletViewer={fullscreenLeafletViewer}
                    setFullscreenLeafletViewer={setFullscreenLeafletViewer}
                    werkingsGebiedUUID={werkingsGebiedUUID}
                />
            ) : null}
            {titleSingular === "Maatregel" &&
            dataLoaded &&
            dataObject["Gebied_Duiding"] &&
            dataObject["Gebied"] ? (
                <ViewFieldGebiedDuiding
                    gebiedDuiding={dataObject["Gebied_Duiding"]}
                />
            ) : null}
        </main>
    )
}

export default RaadpleegObjectDetailMain