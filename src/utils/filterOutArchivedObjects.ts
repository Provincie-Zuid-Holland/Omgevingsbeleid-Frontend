import { isBefore, isValid } from 'date-fns'

import {
    Ambitie,
    Beleidsprestatie,
    Gebiedsprogramma,
    MaatregelListable,
    Thema,
} from '@/api/fetchers.schemas'

const filterOutArchivedObjects = (
    objects: (
        | Ambitie
        | Beleidsprestatie
        | MaatregelListable
        | Thema
        | Gebiedsprogramma
    )[]
) =>
    objects.filter(obj => {
        if (isValid(new Date(obj.Eind_Geldigheid))) {
            return isBefore(new Date(), new Date(obj.Eind_Geldigheid))
        } else {
            return false
        }
    })

export default filterOutArchivedObjects
