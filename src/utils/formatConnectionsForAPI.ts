import cloneDeep from 'lodash.clonedeep'

import {
    BeleidskeuzesRead,
    BeleidskeuzesWrite,
    ListReference,
    MaatregelenRead,
    MaatregelenWrite,
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
        const formattedBeleidskeuze: BeleidskeuzesRead = cloneDeep(
            crudObject as BeleidskeuzesRead
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
                const formattedConnections: ListReference[] =
                    originalConnection.map(connection => ({
                        Koppeling_Omschrijving:
                            connection.Koppeling_Omschrijving,
                        UUID: connection?.Object?.UUID,
                    }))
                formattedBeleidskeuze[property] = formattedConnections
            }
        })

        if (
            'Werkingsgebieden' in formattedBeleidskeuze &&
            formattedBeleidskeuze.Werkingsgebieden !== undefined
        ) {
            const formattedWerkingsgebieden: ListReference[] =
                formattedBeleidskeuze.Werkingsgebieden.map(connection => ({
                    UUID: connection?.Object?.UUID,
                }))
            formattedBeleidskeuze.Werkingsgebieden = formattedWerkingsgebieden
        }

        return formattedBeleidskeuze as BeleidskeuzesWrite
    } else if (titleSingular === 'maatregel') {
        const formattedMaatregel: MaatregelenWrite = cloneDeep(
            crudObject as MaatregelenWrite
        )

        if ('Gebied' in crudObject && crudObject.Gebied !== undefined) {
            formattedMaatregel.Gebied = (
                crudObject as MaatregelenRead
            ).Gebied!.UUID!
        }

        return formattedMaatregel
    } else {
        return crudObject as MutateWriteObjects
    }
}
export default formatConnectionsForAPI
