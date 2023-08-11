import { Text } from '@pzh-ui/components'
import { GripDotsVertical } from '@pzh-ui/icons'
import classNames from 'classnames'

import { Section, SectionType } from '@/config/regulations/sections/types'
import useRegulationStore from '@/store/regulationStore'

import { GROUP_VARIANTS } from '../../../constants'

interface HandleProps {
    section: Section
    isDraggable: boolean
    type: SectionType
    uuid?: string
    expanded?: boolean
    index: number
}

const Handle = ({
    isDraggable,
    section,
    type,
    uuid,
    expanded,
    index,
}: HandleProps) => {
    const activeItem = useRegulationStore(state => state.activeItem)
    const setActiveItem = useRegulationStore(state => state.setActiveItem)

    const Icon = section.defaults.icon

    return (
        <>
            {isDraggable && expanded && (
                <GripDotsVertical
                    size={16}
                    className="mr-[16px] cursor-grab text-pzh-blue transition"
                />
            )}
            <div
                className={classNames(
                    'flex h-[24px] min-w-[24px] items-center justify-center rounded-[4px]',
                    GROUP_VARIANTS[type][1],
                    {
                        'cursor-pointer': !expanded,
                        'bg-pzh-blue': activeItem === uuid,
                        'bg-pzh-warm-gray-light': activeItem !== uuid,
                    }
                )}>
                {expanded ? (
                    <Icon size={14} className="text-pzh-white" />
                ) : (
                    <span
                        className="-mb-1 font-bold text-pzh-white"
                        onClick={() => setActiveItem(uuid)}>
                        {index}
                    </span>
                )}
            </div>
            <Text
                className={classNames('-mb-1 ml-[16px]', {
                    'opacity-100': expanded,
                    'opacity-0': !expanded,
                })}
                color="text-pzh-blue">
                {section.defaults.name}: {uuid}
            </Text>
        </>
    )
}

export default Handle
