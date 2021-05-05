import { format, isBefore } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

/**
 * @param {string|null|undefined} date
 */
const hasInvalidValue = (date) => {
    if (!date) return true

    // This date is automatically assigned to a beginning date with no value
    const dateNoBegin = '1753-01-01T00:00:00Z'
    if (date === dateNoBegin) return true

    return false
}

/**
 * @param {Object} props
 * @param {Object} props.dataObject - The object that contains the date properties
 * @param {boolean} props.prefix - Boolean if the date text should be returned with a prefix
 * @param {boolean} props.prefixOnly - The object that contains the date properties
 * @returns Returns the text that indicates when an object has become valid
 */
const getVigerendText = ({ dataObject, prefix, prefixOnly }) => {
    if (!dataObject) return null

    const begin = dataObject['Begin_Geldigheid']

    if (hasInvalidValue(begin) && prefixOnly) return 'Vigerend vanaf'
    if (hasInvalidValue(begin)) return 'Er is nog geen begin geldigheid'

    const textDate = format(new Date(begin), 'd MMMM yyyy', {
        locale: nlLocale,
    })

    const objectWillTurnValidInFuture = isBefore(
        new Date(),
        new Date(dataObject['Begin_Geldigheid'])
    )

    const textPrefix = objectWillTurnValidInFuture
        ? 'Vigerend vanaf'
        : 'Vigerend sinds'

    if (prefixOnly) {
        return textPrefix
    } else if (prefix) {
        return textPrefix + ' ' + textDate
    } else {
        return textDate
    }
}

export default getVigerendText
