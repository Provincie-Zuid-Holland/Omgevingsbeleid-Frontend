import cloneDeep from 'lodash.clonedeep'

import {
    Beleidskeuze,
    Gebiedsprogramma,
    Maatregel,
    MaatregelUpdate,
} from '@/api/fetchers.schemas'
import { PolicyTitlesSingular } from '@/constants/policyObjects'
import { MutateReadObjects, MutateWriteObjects } from '@/types/dimensions'

/**
 * In this function we format the connections to other policy objects, and the GEO connections
 * The geo connections can exist in singular form on the Gebied property and in plural form on the Werkingsgebieden property
 */
const formatConnectionsForAPI = (
    crudObject: MutateReadObjects,
    titleSingular: PolicyTitlesSingular
) => {
    if (titleSingular === 'beleidskeuze') {
        const formattedBeleidskeuze: Beleidskeuze = cloneDeep(
            crudObject as Beleidskeuze
        )

        const beleidskeuzeConnectionProperties = [
            'Belangen',
            'Beleidsdoelen',
            'Beleidsprestaties',
            'Beleidsregels',
            'Maatregelen',
            'Themas',
            'Verordeningen',
        ] as const

        beleidskeuzeConnectionProperties.forEach(property => {
            const originalConnection = formattedBeleidskeuze[property]
            if (originalConnection) {
                const formattedConnections: any[] = originalConnection.map(
                    connection => ({
                        Koppeling_Omschrijving:
                            connection.Koppeling_Omschrijving || '',
                        UUID: connection?.Object?.UUID || '',
                    })
                )

                formattedBeleidskeuze[property] = formattedConnections
            }
        })

        return formattedBeleidskeuze as MutateWriteObjects
    } else if (titleSingular === 'gebiedsprogramma') {
        const formattedGebiedsprogramma: Gebiedsprogramma = cloneDeep(
            crudObject as Gebiedsprogramma
        )

        const gebiedsprogrammaConnectionProperties = [
            'Ref_Maatregelen',
        ] as const

        gebiedsprogrammaConnectionProperties.forEach(property => {
            const originalConnection = formattedGebiedsprogramma[property]
            if (originalConnection) {
                const formattedConnections: any[] = originalConnection.map(
                    connection => ({
                        Koppeling_Omschrijving:
                            connection.Koppeling_Omschrijving || '',
                        UUID: connection?.Object?.UUID || '',
                    })
                )

                formattedGebiedsprogramma[property] = formattedConnections
            }
        })

        return formattedGebiedsprogramma as MutateWriteObjects
    } else if (titleSingular === 'maatregel') {
        const formattedMaatregel: MaatregelUpdate = cloneDeep(
            crudObject as MaatregelUpdate
        )

        if ('Gebied' in crudObject && crudObject.Gebied !== undefined) {
            formattedMaatregel.Gebied_UUID = (
                crudObject as Maatregel
            ).Gebied.UUID
        }

        return formattedMaatregel as MutateWriteObjects
    } else {
        return crudObject as MutateWriteObjects
    }
}
export default formatConnectionsForAPI
