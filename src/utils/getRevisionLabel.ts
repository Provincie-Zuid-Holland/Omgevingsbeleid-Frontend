import { formatDate } from '@pzh-ui/components'

import { ModelReturnType } from '@/config/objects/types'

const getRevisionLabel = (
    object: ModelReturnType,
    initialObject: ModelReturnType,
    latest?: string
): string => {
    if (!object.Start_Validity) return ''

    const today = new Date().toDateString()
    const formattedDate = formatDate(
        new Date(object.Start_Validity),
        'd MMMM yyyy'
    )

    let status = 'Vigerend'
    let prefix = 'Sinds'

    if (object.Start_Validity > today) {
        status = 'Vastgesteld'
        prefix = 'Vanaf'
    } else if (
        initialObject.Start_Validity !== object.Start_Validity ||
        object.UUID !== latest
    ) {
        status = 'Gearchiveerd'
    }

    return `${prefix} ${formattedDate} (${status})`
}

export default getRevisionLabel
