import { PillButton } from '@pzh-ui/components'
import { v4 as uuidv4 } from 'uuid'

import * as sections from '@/config/regulations/sections'
import { Section } from '@/config/regulations/sections/types'
import useRegulationStore from '@/store/regulationStore'

interface AddItemProps {
    section: Section
    index: number
    parentIndices: number[]
}

const AddItem = ({ section, index, parentIndices }: AddItemProps) => {
    const addItem = useRegulationStore(state => state.addItem)

    return (
        <div className="flex items-center">
            <span className="text-[16px] text-pzh-blue">
                Invoegen in {section.defaults.demonstrative}{' '}
                {section.defaults.name.toLowerCase()}:
            </span>
            {section.children?.map(type => {
                const childSection = sections[type]

                return (
                    <PillButton
                        key={childSection.type}
                        className="ml-[16px]"
                        onPress={() =>
                            addItem([...parentIndices, index], {
                                type,
                                uuid: uuidv4(),
                            })
                        }>
                        {childSection.defaults.name}
                    </PillButton>
                )
            })}
        </div>
    )
}

export default AddItem
