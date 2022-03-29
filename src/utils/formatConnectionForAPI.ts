import cloneDeep from 'lodash.clonedeep'

import { BeleidskeuzesWrite, ListReference } from '@/api/fetchers.schemas'
// import type {MutatePolicyPageProps} from '@/pages/MutatePolicyPage'
import { PossibleWriteObjects } from '@/pages/MutatePolicyPage'

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

const getProperties = (titleSingular: string) => {
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

const formatConnectionForAPI = (crudObject: PossibleWriteObjects, titleSingular: string) => {
    const properties = getProperties(titleSingular)
    if (!properties) {
        return crudObject
    } else {
        const formattedCrudObject = cloneDeep(crudObject)
        properties.forEach(property => {
            if (typeof property === 'string') {
                const originalConnection:  = formattedCrudObject[property]
                if (originalValue) {
                    const 
                    formattedCrudObject[property] = {
                        originalValue: '',
                    }
                }
            }
        })
        return formattedCrudObject
    }
}

export default formatConnectionForAPI
