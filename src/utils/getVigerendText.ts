import { isBefore } from 'date-fns'

import formatDate from './formatDate'

/**
 * @param {string|null|undefined} date
 */
const hasInvalidValue = (date: string) => {
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
 * @param {boolean} props.prefixOnly - Returns only the prefix
 * @returns Returns the text that indicates when an object has become valid
 */

interface GetVigerendTextProps {
    dataObject: any
    revisionObjects?: [any]
    prefix?: boolean
    prefixOnly?: boolean
}

const getVigerendText = ({
    dataObject,
    revisionObjects,
    prefix,
    prefixOnly,
}: GetVigerendTextProps) => {
    if (!dataObject) return null

    const dateStartValidity = dataObject['Begin_Geldigheid']

    if (hasInvalidValue(dateStartValidity) && prefixOnly)
        return 'Vigerend vanaf'
    if (hasInvalidValue(dateStartValidity))
        return 'Er is nog geen begin geldigheid'

    const textDate = formatDate(new Date(dateStartValidity), 'd MMMM yyyy')

    const objectWillTurnValidInFuture = isBefore(
        new Date(),
        new Date(dataObject['Begin_Geldigheid'])
    )

    const checkIfDataObjectIsArchived = () => {
        if (!revisionObjects) return false

        const indexOfDataObjectInRevisions = revisionObjects.findIndex(
            e => e.UUID === dataObject.UUID
        )
        const indexOfFirstValidObjectInRevisions = revisionObjects.findIndex(
            e => e.Status === 'Vigerend'
        )

        return indexOfFirstValidObjectInRevisions < indexOfDataObjectInRevisions
    }

    const currentDataObjectIsArchived = checkIfDataObjectIsArchived()

    const textPrefix =
        objectWillTurnValidInFuture && !currentDataObjectIsArchived
            ? 'Vigerend vanaf'
            : !objectWillTurnValidInFuture && !currentDataObjectIsArchived
            ? 'Vigerend sinds'
            : currentDataObjectIsArchived
            ? 'In werking getreden op'
            : ''

    if (prefixOnly) {
        return textPrefix
    } else if (prefix) {
        return textPrefix + ' ' + textDate
    } else {
        return textDate
    }
}

export default getVigerendText
