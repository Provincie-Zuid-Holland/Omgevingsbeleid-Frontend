import { formatDate } from '@pzh-ui/components'

import { ModelReturnType } from '@/config/objects/types'

import { parseUtc } from './parseUtc'

type MaybeRevision<T> = T & { isRevision?: boolean }
type STATUS = 'Vigerend' | 'Vastgesteld' | 'Gearchiveerd'
type PREFIX = 'Sinds' | 'Vanaf'

/**
 * Builds a revision label based on validity dates/status.
 */
const getRevisionLabel = (
    object: MaybeRevision<ModelReturnType>,
    initialObject: MaybeRevision<ModelReturnType>,
    latest?: string
): string => {
    const { start_validity, end_validity, id, isRevision } = object
    if (!start_validity) return ''

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = parseUtc(start_validity)
    const endDate = end_validity ? parseUtc(end_validity) : null
    const formattedDate = formatDate(startDate, 'd MMMM yyyy')

    if (isRevision) return 'Ontwerpversie'

    // Defaults
    let status: STATUS = 'Vigerend'
    let prefix: PREFIX = 'Sinds'

    if (startDate > today) {
        status = 'Vastgesteld'
        prefix = 'Vanaf'
    } else if (
        initialObject.start_validity !== start_validity ||
        id !== latest
    ) {
        status = 'Gearchiveerd'
    }

    if (endDate && endDate < today) {
        return `${prefix} ${formattedDate}`
    }

    return `${prefix} ${formattedDate} (${status})`
}

export default getRevisionLabel
