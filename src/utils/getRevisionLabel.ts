import { formatDate } from '@pzh-ui/components'

import { ModelReturnType } from '@/config/objects/types'
import { parseUtc } from './parseUtc'

const getRevisionLabel = (
    object: ModelReturnType,
    initialObject: ModelReturnType,
    latest?: string
): string => {
    const { Start_Validity, End_Validity, UUID } = object
    if (!Start_Validity) return ''

    const today = new Date()
    const startDate = parseUtc(Start_Validity)
    const endDate = End_Validity ? parseUtc(End_Validity) : null
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
