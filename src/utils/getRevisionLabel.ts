import { formatDate } from '@pzh-ui/components'

import { ModelReturnType } from '@/config/objects/types'

const getRevisionLabel = (
    object: ModelReturnType,
    initialObject: ModelReturnType,
    latest?: string
): string => {
    const { Start_Validity, End_Validity, UUID } = object
    if (!Start_Validity) return ''

    const today = new Date()
    const startDate = new Date(Start_Validity)
    const endDate = End_Validity ? new Date(End_Validity) : null
    const formattedDate = formatDate(startDate, 'd MMMM yyyy')

    let status = 'Vigerend'
    let prefix = 'Sinds'

    if (startDate > today) {
        status = 'Vastgesteld'
        prefix = 'Vanaf'
    } else if (
        initialObject.Start_Validity !== Start_Validity ||
        UUID !== latest
    ) {
        status = 'Gearchiveerd'
    }

    if (endDate && endDate < today) {
        return `${prefix} ${formattedDate}`
    }

    return `${prefix} ${formattedDate} (${status})`
}

export default getRevisionLabel
