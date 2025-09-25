import { ModelReturnType } from '@/config/objects/types'
import { formatDate } from '@pzh-ui/components'

type MaybeRevision<T> = T & { isRevision?: boolean }
type STATUS = 'Vigerend' | 'Vastgesteld' | 'Gearchiveerd'
type PREFIX = 'Sinds' | 'Vanaf'

/**
 * Convert an ISO date string (or null/undefined) to a Date object,
 * or return null if falsy.
 */
const toDate = (iso?: string | null): Date | null =>
    iso ? new Date(iso) : null

/**
 * Builds a revision label based on validity dates/status.
 */
const getRevisionLabel = (
    object: MaybeRevision<ModelReturnType>,
    initialObject: MaybeRevision<ModelReturnType>,
    latest?: string
): string => {
    const { Start_Validity, End_Validity, UUID, isRevision } = object
    if (!Start_Validity) return ''

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startDate = toDate(Start_Validity)!
    const endDate = toDate(End_Validity)
    const formattedDate = formatDate(startDate, 'd MMMM yyyy')

    if (isRevision) return 'Ontwerpversie'

    // Defaults
    let status: STATUS = 'Vigerend'
    let prefix: PREFIX = 'Sinds'

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
