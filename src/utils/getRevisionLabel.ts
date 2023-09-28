import { formatDate } from '@pzh-ui/components'

import { ModelReturnType } from '@/config/objects/types'

const getRevisionLabel = (
    object: ModelReturnType,
    initialObject: ModelReturnType,
    latest?: string
) => {
    let status = 'Vigerend'
    let date = ''

    if (object.Start_Validity) {
        date = formatDate(new Date(object.Start_Validity), 'd MMMM yyyy')

        if (
            initialObject.Start_Validity !== object.Start_Validity ||
            object.UUID !== latest
        ) {
            status = 'Gearchiveerd'
        }
    }

    return `Sinds ${date} (${status})`
}

export default getRevisionLabel
