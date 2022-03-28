import {
    AmbitiesRead,
    VerordeningenRead,
    BeleidskeuzesRead,
    BeleidsmodulesRead,
} from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'
import { getWriteObjectProperties } from '@/utils/createEmptyWriteObject'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

export const createWriteObjectFromReadObject = (
    readObject:
        | AmbitiesRead
        | VerordeningenRead
        | BeleidskeuzesRead
        | BeleidsmodulesRead,
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    const writeProperties = getWriteObjectProperties(titleSingular)
    const writeObject: { [key: string]: any } = {}
    writeProperties.forEach(property => {
        writeObject[property] = readObject[property]
    })
    return writeObject
}
