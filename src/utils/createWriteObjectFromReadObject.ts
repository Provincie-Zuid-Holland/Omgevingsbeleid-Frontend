import allDimensies from '@/constants/dimensies'
import { MutateWriteObjects, MutateReadObjects } from '@/types/dimensions'
import { getWriteObjectProperties } from '@/utils/createEmptyWriteObject'

import formatUsersForUI from './formatUsersForUI'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

export const createWriteObjectFromReadObject = (
    readObject: MutateReadObjects,
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    const writeProperties = getWriteObjectProperties(titleSingular)
    const writeObject: { [key: string]: any } = {}
    writeProperties.forEach(property => {
        writeObject[property] = readObject[property as keyof MutateWriteObjects]
    })
    const formattedWriteObject = formatUsersForUI(writeObject)

    return formattedWriteObject as MutateWriteObjects
}
