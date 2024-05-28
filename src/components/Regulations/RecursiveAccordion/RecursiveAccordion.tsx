import classNames from 'clsx'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/Accordion'
import DropArea from '@/components/DropArea'
import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'
import equalArrays from '@/utils/equalArrays'
import handleViewTransition from '@/utils/handleViewTransition'

import { GROUP_VARIANTS } from '../constants'
import AddItem from './components/AddItem'
import Handle from './components/Handle'

interface RecursiveAccordionProps {
    structure: Structure[]
    parentIndices?: number[]
    expanded?: boolean
    hasCallback?: boolean
}

const RecursiveAccordion = ({
    structure,
    parentIndices = [],
    expanded,
    hasCallback = true,
}: RecursiveAccordionProps) => {
    const setDraggingItem = useRegulationStore(state => state.setDraggingItem)
    const draggingItem = useRegulationStore(state => state.draggingItem)
    const moveItem = useRegulationStore(state => state.moveItem)
    const activeItem = useRegulationStore(state => state.activeItem)
    const setActiveItem = useRegulationStore(state => state.setActiveItem)

    const activeModal = useModalStore(state => state.activeModal)

    const { dragProps, isDragging } = useDrag({
        draggable: structure.length > 1 && expanded,
        onDragStart: setDraggingItem,
        onDragEnd: () => setDraggingItem(null),
    })

    const handleDrop = (from: number[], to: number[]) =>
        handleViewTransition(() => moveItem(from, to))

    return (
        <Accordion
            className="mb-3"
            activeItem={!expanded ? activeItem : undefined}
            onClickCallback={hasCallback ? setActiveItem : undefined}>
            {structure.map(
                (
                    {
                        type: parentType,
                        uuid,
                        title,
                        children,
                        index: itemIndex,
                    },
                    index
                ) => {
                    const section = sections[parentType]

                    const currDragged =
                        draggingItem && draggingItem[draggingItem.length - 1]
                    const isDraggingAndValid =
                        isDragging &&
                        draggingItem &&
                        !equalArrays(draggingItem, [...parentIndices, index])

                    const showTopDropArea = isDraggingAndValid && index === 0
                    const showBottomDropArea =
                        isDraggingAndValid && currDragged !== index + 1

                    return (
                        <AccordionItem
                            key={uuid}
                            uuid={uuid}
                            isDisabled={!!!section.children?.length}
                            className={classNames(
                                'relative block',
                                GROUP_VARIANTS[parentType][0],
                                {
                                    'border-none': !expanded,
                                }
                            )}
                            style={
                                !!!activeModal
                                    ? {
                                          viewTransitionName: `card-${uuid}`,
                                          zIndex: structure.length - index,
                                      }
                                    : undefined
                            }>
                            {showTopDropArea && draggingItem && (
                                <DropArea
                                    position="top"
                                    onDrop={() =>
                                        handleDrop(draggingItem, [
                                            ...parentIndices,
                                            index,
                                        ])
                                    }
                                />
                            )}
                            <AccordionTrigger
                                className={classNames('overflow-hidden py-2', {
                                    'active:animate-pulse active:cursor-grabbing active:bg-pzh-blue-100/10':
                                        expanded && structure.length > 1,
                                    'pr-4': !!!section.children?.length,
                                })}
                                classNameButton={classNames({
                                    'after:w-full': structure.length <= 1,
                                    'after:w-[calc(100%-36px)]':
                                        structure.length > 1,
                                    hidden: !expanded,
                                })}
                                {...dragProps([...parentIndices, index])}>
                                <Handle
                                    isDraggable={structure.length > 1}
                                    section={section}
                                    type={parentType}
                                    uuid={uuid}
                                    expanded={expanded}
                                    title={title}
                                    index={itemIndex}
                                />
                            </AccordionTrigger>
                            <AccordionContent
                                className={classNames(
                                    structure.length > 1
                                        ? 'pl-[72px]'
                                        : 'pl-[40px]',
                                    { hidden: !expanded }
                                )}>
                                {!!children?.length && (
                                    <RecursiveAccordion
                                        structure={children}
                                        parentIndices={[
                                            ...parentIndices,
                                            index,
                                        ]}
                                        expanded={expanded}
                                        hasCallback={false}
                                    />
                                )}

                                {!!section.children?.length && (
                                    <AddItem
                                        section={section}
                                        index={index}
                                        parentIndices={parentIndices}
                                        parentUuid={uuid}
                                    />
                                )}
                            </AccordionContent>
                            {showBottomDropArea && draggingItem && (
                                <DropArea
                                    position="bottom"
                                    onDrop={() =>
                                        handleDrop(draggingItem, [
                                            ...parentIndices,
                                            (currDragged || 0) > index
                                                ? index + 1
                                                : index,
                                        ])
                                    }
                                />
                            )}
                        </AccordionItem>
                    )
                }
            )}
        </Accordion>
    )
}

export default RecursiveAccordion
