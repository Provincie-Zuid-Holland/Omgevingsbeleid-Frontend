import { Text } from '@pzh-ui/components'
import { Circle, CircleCheck } from '@pzh-ui/icons'

import { Dispatch } from '../verordeningEditContext'

export interface VerordeningAddSectionTypeContainerProps {
    addingSectionType: 'Artikel' | 'Afdeling' | 'Paragraaf' | null
    type: 'Afdeling' | 'Paragraaf' | 'Artikel'
    dispatch: Dispatch
}

const VerordeningAddSectionTypeContainer = ({
    addingSectionType,
    type,
    dispatch,
}: VerordeningAddSectionTypeContainerProps) => {
    const typeIsSelected = addingSectionType === type

    return (
        <div
            onClick={() => {
                dispatch({
                    type: 'setAddingSectionType',
                    payload: type,
                })
            }}
            className="flex items-center justify-start py-3 pl-5 pr-12 mt-2 font-bold rounded cursor-pointer group bg-pzh-blue-super-light">
            <div className="flex items-center">
                {typeIsSelected ? (
                    <CircleCheck />
                ) : (
                    <Circle className="transition duration-150 ease-in rounded-full group-hover:bg-gray-50" />
                )}
                <Text className="mt-1 ml-5">{type}</Text>
            </div>
        </div>
    )
}

export default VerordeningAddSectionTypeContainer
