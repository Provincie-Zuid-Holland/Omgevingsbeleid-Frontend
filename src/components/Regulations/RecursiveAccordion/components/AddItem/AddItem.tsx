import { PillButton } from '@pzh-ui/components'

import * as sections from '@/config/regulations/sections'
import { Section, SectionType } from '@/config/regulations/sections/types'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

interface AddItemProps {
    section: Section
    index: number
    parentIndices: number[]
    parentUuid?: string
}

const AddItem = ({
    section,
    index,
    parentIndices,
    parentUuid,
}: AddItemProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const setItemAction = useRegulationStore(state => state.setItemAction)

    const handleAddItem = (type: SectionType, path: number[]) => {
        setItemAction({ action: 'add', type, path, uuid: parentUuid })
        setActiveModal('regulationAdd')
    }

    return (
        <div className="flex items-center gap-4">
            <span className="text-s text-pzh-blue-500">
                Invoegen in {section.defaults.demonstrative}{' '}
                {section.defaults.singular}:
            </span>
            {section.children?.map(type => {
                const childSection = sections[type]

                return (
                    <PillButton
                        key={childSection.type}
                        onPress={() =>
                            handleAddItem(type, [...parentIndices, index])
                        }>
                        {childSection.defaults.singularCapitalize}
                    </PillButton>
                )
            })}
        </div>
    )
}

export default AddItem
