import { GebruikerInline } from '@/api/fetchers.schemas'
import { MutateWriteObjects, MutateReadObjects } from '@/types/dimensions'
import { getWriteObjectProperties } from '@/utils/createEmptyWriteObject'

export const createWriteObjectFromReadObject = (
    readObject: MutateReadObjects,
    titleSingular: string
) => {
    const writeProperties = getWriteObjectProperties(titleSingular)

    if (!writeProperties) return null

    const writeObject: Partial<MutateWriteObjects> = {}
    writeProperties.forEach(property => {
        if (property.includes('_UUID')) {
            const readProperty = property.replace('_UUID', '')

            return (writeObject[property as keyof typeof writeObject] = (
                readObject[
                    readProperty as keyof MutateReadObjects
                ] as GebruikerInline
            )?.UUID)
        }

        return (writeObject[property as keyof typeof writeObject] =
            readObject[property as keyof MutateWriteObjects])
    })

    return writeObject as MutateWriteObjects
}
