import { MutateWriteObjects, MutateReadObjects } from '@/types/dimensions'
import { getWriteObjectProperties } from '@/utils/createEmptyWriteObject'

import formatUsersForUI from './formatUsersForUI'

export const createWriteObjectFromReadObject = (
    readObject: MutateReadObjects,
    titleSingular: string
) => {
    const writeProperties = getWriteObjectProperties(titleSingular)

    if (!writeProperties) return null

    const writeObject: { [key: string]: any } = {}
    writeProperties.forEach(property => {
        writeObject[property as keyof typeof writeObject] =
            readObject[property as keyof MutateWriteObjects]
    })
    const formattedWriteObject = formatUsersForUI(writeObject)

    return formattedWriteObject as MutateWriteObjects
}
