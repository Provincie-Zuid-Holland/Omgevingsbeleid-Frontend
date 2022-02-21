import { isBefore, isValid } from 'date-fns'

const filterOutArchivedObjects = (objects: any) =>
    objects.filter((obj: any) => {
        if (isValid(new Date(obj.Eind_Geldigheid))) {
            return isBefore(new Date(), new Date(obj.Eind_Geldigheid))
        } else {
            return false
        }
    })

export default filterOutArchivedObjects
