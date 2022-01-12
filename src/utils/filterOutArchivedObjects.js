import { isBefore, isValid } from 'date-fns'

const filterOutArchivedObjects = objects =>
    objects.filter(obj => {
        if (isValid(new Date(obj.Eind_Geldigheid))) {
            return isBefore(new Date(), new Date(obj.Eind_Geldigheid))
        } else {
            return false
        }
    })

export default filterOutArchivedObjects
