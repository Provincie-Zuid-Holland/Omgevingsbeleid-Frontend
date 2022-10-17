import { cloneDeep } from 'lodash'

import { MutateReadObjects, MutateWriteObjects } from '@/types/dimensions'

const formatUsersForUI = (
    crudObject: MutateWriteObjects | MutateReadObjects
) => {
    const formattedCrudObject = cloneDeep(crudObject)

    const userProperties = [
        'Eigenaar_1',
        'Eigenaar_2',
        'Opdrachtgever',
        'Portefeuillehouder_1',
        'Portefeuillehouder_2',
    ] as const

    userProperties.forEach(property => {
        const potentialUser =
            formattedCrudObject[property as keyof typeof formattedCrudObject]

        if (typeof potentialUser === 'object' && potentialUser !== null) {
            formattedCrudObject[property as keyof typeof formattedCrudObject] =
                potentialUser.UUID
        }
    })

    return formattedCrudObject
}

export default formatUsersForUI
