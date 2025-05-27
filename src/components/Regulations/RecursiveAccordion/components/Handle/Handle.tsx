import { Button, Text } from '@pzh-ui/components'
import { GripDotsVertical, PenToSquare, TrashCan } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useShallow } from 'zustand/react/shallow'

import { Section, SectionType } from '@/config/regulations/sections/types'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

import { GROUP_VARIANTS } from '../../../constants'

interface HandleProps {
    section: Section
    isDraggable: boolean
    type: SectionType
    uuid?: string
    title?: string
    expanded?: boolean
    index?: string
}

const Handle = ({
    isDraggable,
    section,
    type,
    uuid,
    title,
    expanded,
    index,
}: HandleProps) => {
    const { activeItem, setActiveItem, setItemAction } = useRegulationStore(
        useShallow(state => ({
            setItemAction: state.setItemAction,
            activeItem: state.activeItem,
            setActiveItem: state.setActiveItem,
        }))
    )
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const Icon = section.defaults.icon

    const handleDelete = () => {
        setItemAction({ action: 'delete', type, uuid, index })
        setActiveModal('regulationDelete')
    }

    const handleEdit = () => {
        setItemAction({ action: 'edit', type, uuid, index })
        setActiveModal('regulationEdit')
    }

    return (
        <div className="flex w-full justify-between pr-4">
            <div className="flex items-center gap-4">
                {isDraggable && expanded && (
                    <GripDotsVertical
                        size={16}
                        className="cursor-grab text-pzh-blue-500 transition"
                    />
                )}
                <Button
                    variant="default"
                    className={classNames(
                        'flex h-6 min-w-[24px] items-center justify-center rounded',
                        GROUP_VARIANTS[type][1],
                        {
                            'cursor-pointer': !expanded,
                            'bg-pzh-blue-500': activeItem === uuid,
                            'bg-pzh-warm-gray-100': activeItem !== uuid,
                        }
                    )}
                    isDisabled={expanded}
                    onPress={
                        !expanded
                            ? () =>
                                  activeItem !== uuid
                                      ? setActiveItem(uuid)
                                      : undefined
                            : undefined
                    }
                    aria-label={`${!expanded ? 'Open' : 'Sluit'} ${
                        section.defaults.singularCapitalize
                    } ${index}`}>
                    {expanded ? (
                        <Icon size={14} className="text-pzh-white" />
                    ) : (
                        <span className="-mb-1 font-bold text-pzh-white">
                            {index}
                        </span>
                    )}
                </Button>
                <Text
                    className={classNames('-mb-1', {
                        'opacity-100': expanded,
                        'opacity-0': !expanded,
                    })}
                    color="text-pzh-blue-500">
                    {section.defaults.singularCapitalize} {index}: {title}
                </Text>
            </div>
            <div className="relative z-[1] flex items-center gap-4">
                <Button
                    variant="default"
                    onPress={handleDelete}
                    isDisabled={!expanded}
                    aria-label="Verwijderen">
                    <TrashCan size={16} color="text-pzh-blue-500" />
                </Button>
                <Button
                    variant="default"
                    onPress={handleEdit}
                    isDisabled={!expanded}
                    aria-label="Wijzigen">
                    <PenToSquare size={16} color="text-pzh-blue-500" />
                </Button>
            </div>
        </div>
    )
}

export default Handle
