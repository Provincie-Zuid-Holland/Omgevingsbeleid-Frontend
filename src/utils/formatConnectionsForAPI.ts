import cloneDeep from 'lodash.clonedeep'

import {
    BeleidskeuzesRead,
    BeleidskeuzesWrite,
    ListReference,
} from '@/api/fetchers.schemas'
import { filteredDimensieConstants } from '@/constants/dimensies'
import { PossiblePATCHCrudObjects } from '@/types/dimensions'

const beleidskeuzesConnectionProperties = {
    Ambities: undefined,
    Belangen: undefined,
    Beleidsdoelen: undefined,
    Beleidsprestaties: undefined,
    Beleidsregels: undefined,
    Maatregelen: undefined,
    Themas: undefined,
    Verordeningen: undefined,
    Werkingsgebieden: undefined,
} as const

const getProperties = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    const getPropertiesOfObject = (
        obj: typeof beleidskeuzesConnectionProperties
    ) => (Object.keys(obj) as Array<keyof typeof obj>).map(key => key)

    switch (titleSingular) {
        case 'Beleidskeuze':
            return getPropertiesOfObject(beleidskeuzesConnectionProperties)
        default:
            return null
    }
}

/** Currently we only need to format connections for Beleidskeuze objects */
const formatConnectionsForAPI = (
    crudObject: PossiblePATCHCrudObjects,
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    const properties = getProperties(titleSingular)
    if (!properties || titleSingular !== 'Beleidskeuze') return crudObject

    const formattedCrudObject: BeleidskeuzesRead = cloneDeep(
        crudObject as BeleidskeuzesRead
    )
    properties.forEach(property => {
        const originalConnection = formattedCrudObject[property]
        if (originalConnection) {
            const formattedConnections: ListReference[] =
                originalConnection.map(connection => ({
                    Koppeling_Omschrijving: connection.Koppeling_Omschrijving,
                    UUID: connection?.Object?.UUID,
                }))
            formattedCrudObject[property] = formattedConnections
        }
    })
    return formattedCrudObject as BeleidskeuzesWrite
}

export default formatConnectionsForAPI
