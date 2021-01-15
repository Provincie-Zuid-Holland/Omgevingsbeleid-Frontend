import { isBefore } from 'date-fns'
import scrollToElement from './scrollToElement'
import { toast } from 'react-toastify'

function eindDateIsBeforeBeginDate(titleSingular, crudObject) {
    if (isBefore(crudObject.Eind_Geldigheid, crudObject.Begin_Geldigheid)) {
        const dataObjectProperty = 'Eind_Geldigheid'
        const elSelector = `form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`
        scrollToElement(elSelector)
        toast(
            'De datum van uitwerkingtreding mag niet eerder zijn dan de datum van inwerkingtreding'
        )
        return true
    }
    return false
}

export default eindDateIsBeforeBeginDate
