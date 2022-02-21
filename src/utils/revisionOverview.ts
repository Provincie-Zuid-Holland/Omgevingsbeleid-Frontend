import formatDate from '@/utils/formatDate'

/**
 * Function to map over the revision objects and return the value of the label, value and isDisabled parameters.
 *
 * @param {array} revisionObjects - Contains the revision objects
 * @param {string} type - Parameter containing the 'left' or 'right' value.
 */
const getOptions = (
    revisionObjects: any[],
    type: string,
    rightSelect: any,
    leftSelect: any
) => {
    const getValidText = (object: any) => {
        if (!object['Begin_Geldigheid'])
            return 'Er is nog geen begin geldigheid'

        const textDate = formatDate(
            new Date(object['Begin_Geldigheid']),
            'd MMMM yyyy'
        )
        const isActive =
            object.Status && object.Status === 'Vigerend' ? 'Sinds' : 'Vanaf'

        return isActive + ' ' + textDate
    }

    return revisionObjects.map((obj, index) => {
        return {
            label: `${getValidText(obj)} (${obj.uiStatus})`,
            value: obj.UUID,
            isDisabled: checkIsDisabled(
                index,
                type,
                rightSelect,
                leftSelect,
                revisionObjects
            ),
        }
    })
}

/**
 * Checks if an options is disabled.
 * When we select an option, we disable the previous or following options, based on the optionsType
 */
const checkIsDisabled = (
    index: number,
    optionsType: string,
    rightSelect: any,
    leftSelect: any,
    revisionObjects: any
) => {
    if (optionsType === 'left' && !rightSelect) return false
    if (optionsType === 'right' && !leftSelect) return false

    const leftSelectIndex = revisionObjects.findIndex(
        (e: any) => e.UUID === leftSelect
    )
    const rightSelectIndex = revisionObjects.findIndex(
        (e: any) => e.UUID === rightSelect
    )

    if (optionsType === 'left') {
        // Disabled if the rightSelectIndex comes after the current object index
        return index <= rightSelectIndex
    } else if (optionsType === 'right') {
        // Disabled if the leftSelectIndex comes after the current object index
        return index >= leftSelectIndex
    }
}

export { getOptions }
