import { cloneDeep } from 'lodash'

import { MutateReadObjects, MutateWriteObjects } from '@/types/dimensions'

const formatWerkingsgebiedenForWrite = (crudObject: MutateReadObjects) => {
    const formattedCrudObject = cloneDeep(crudObject) as MutateWriteObjects
    if (
        'Werkingsgebieden' in crudObject &&
        'Werkingsgebieden' in formattedCrudObject
    ) {
        formattedCrudObject.Werkingsgebieden = crudObject.Werkingsgebieden?.map(
            geoArea => ({
                Koppeling_Omschrijving: geoArea.Koppeling_Omschrijving,
                UUID: geoArea?.Object?.UUID,
            })
        )
    }

    return formattedCrudObject
}

export default formatWerkingsgebiedenForWrite
