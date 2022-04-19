import { useState, useEffect } from 'react'

import { LeafletRevisionOverview } from '@/components/Leaflet'

export interface RevisionOverviewWerkingsgebiedProps {
    originalObject: any
    changesObject: any
}

/**
 * Displays the changes of the connected geo area on a leaflet map
 */
const RevisionOverviewWerkingsgebied = ({
    originalObject,
    changesObject,
}: RevisionOverviewWerkingsgebiedProps) => {
    const [containsGeo, setContainsGeo] = useState<boolean>(true)
    /**
     * We get this werkingsgebied from the changesObject.
     * This means the 'Werkingsgebieden' value will contain an object with the 'new', 'removed' and 'same' properties
     * We first check 'new', if the array is empty we check 'same'. If that is also empty we know that the rightSelect state value has no werkingsgebied
     * If that is the case, we return a unique string to indicate that, else we set the title
     * @returns {string} Contains a string that indicates the changes to the GEO properties
     */
    const getSentenceIndicatingChange = () => {
        if (
            changesObject.Werkingsgebieden.new.length > 0 &&
            changesObject.Werkingsgebieden.removed.length > 0
        ) {
            return `Beleidskeuze '${originalObject.Titel}' is gewijzigd van gebied '${changesObject?.Werkingsgebieden?.removed[0]?.Object?.Werkingsgebied}' naar gebied '${changesObject?.Werkingsgebieden?.new[0]?.Object?.Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.new.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' heeft '${changesObject?.Werkingsgebieden?.new[0]?.Object?.Werkingsgebied}' als werkingsgebied gekregen.`
        } else if (changesObject.Werkingsgebieden.same.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' is niet gewijzigd, en is gekoppeld aan '${changesObject?.Werkingsgebieden?.same[0]?.Object?.Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.removed.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' was gekoppeld aan gebied '${changesObject?.Werkingsgebieden?.removed[0]?.Object?.Werkingsgebied}', maar deze koppeling is verwijderd.`
        } else {
            // The leftSelect value and the rightSelect value both didn't have a werkingsgebied
            return `Beleidskeuze '${originalObject.Titel}' heeft voor beide geselecteerde objecten geen werkingsgebied`
        }
    }

    useEffect(() => {
        if (
            changesObject?.Werkingsgebieden?.new?.length === 0 &&
            changesObject?.Werkingsgebieden?.same?.length === 0 &&
            changesObject?.Werkingsgebieden?.removed?.length === 0
        ) {
            setContainsGeo(false)
        }
    }, [changesObject])

    /**
     * @returns {array} containing an Array and an Object. The array contains the GEO UUIDS. The Object contains the changes of the object.
     */
    const getGEO = () => {
        const gebiedenChanges = {
            new: [],
            removed: [],
            same: [],
        }

        const gebiedenUUIDS: string[] = []

        Object.keys(gebiedenChanges).forEach(changeProperty => {
            changesObject.Werkingsgebieden[changeProperty].forEach(
                (werkingsgebied: any) => {
                    gebiedenChanges[
                        changeProperty as keyof typeof gebiedenChanges
                    ] = werkingsgebied.Object.UUID
                    gebiedenUUIDS.push(werkingsgebied.Object.UUID)
                }
            )
        })

        return [gebiedenUUIDS, gebiedenChanges]
    }

    const sentenceIndicatingChange = getSentenceIndicatingChange()
    const [gebiedenUUIDS, gebiedenChanges] = getGEO()

    return (
        <div className="w-full">
            <p
                className={`mt-4 leading-7 break-words w-full whitespace-pre-line ${
                    containsGeo ? 'text-gray-800' : 'italic text-gray-600'
                }`}>
                {sentenceIndicatingChange}
            </p>
            {containsGeo ? (
                <>
                    <div
                        className="mt-4 overflow-hidden border border-gray-300 rounded-lg"
                        id={`revision-overview-leaflet`}>
                        <LeafletRevisionOverview
                            gebiedenUUIDS={gebiedenUUIDS}
                            gebiedenChanges={gebiedenChanges}
                            id="revision-overview-leaflet-map"
                        />
                    </div>
                    <ul className="mt-4">
                        <LegendItem
                            color="#E74C3C"
                            label="Verwijderd werkingsgebied"
                        />
                        <LegendItem
                            color="#2ECC71"
                            label="Toegevoegd werkingsgebied"
                        />
                        <LegendItem
                            color="#2980B9"
                            label="Ongewijzigd werkingsgebied"
                        />
                    </ul>
                </>
            ) : null}
        </div>
    )
}

/**
 * @returns A component for a legenda item containing a color indicator and a label
 */
const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <li className="flex items-center mt-1">
        <span
            style={{ backgroundColor: color }}
            className="inline-block w-3 h-3 mr-2 rounded-full"
        />
        <span>{label}</span>
    </li>
)

export default RevisionOverviewWerkingsgebied
