import { PillButton, Text } from '@pzh-ui/components'
import { GripDotsVertical } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { flushSync } from 'react-dom'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/Accordion'
import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useRegulationStore from '@/store/regulationStore'
import equalArrays from '@/utils/equalArrays'

import { GROUP_VARIANTS } from '../constants'

interface RecursiveAccordionProps {
    structure: Structure[]
    parentIndices?: number[]
}

const RecursiveAccordion = ({
    structure,
    parentIndices = [],
}: RecursiveAccordionProps) => {
    const addItem = useRegulationStore(state => state.addItem)
    const setDraggingItem = useRegulationStore(state => state.setDraggingItem)
    const draggingItem = useRegulationStore(state => state.draggingItem)
    const moveItem = useRegulationStore(state => state.moveItem)

    const { dragProps, isDragging } = useDrag({
        draggable: structure.length > 1,
        onDragStart: setDraggingItem,
        onDragEnd: () => setDraggingItem(null),
    })

    const handleDrop = (from: number[], to: number[]) => {
        // @ts-ignore
        if (document.startViewTransition) {
            // @ts-ignore
            document.startViewTransition(() => {
                flushSync(() => {
                    moveItem(from, to)
                })
            })
            // If view transitions aren't supported (e.g. mobile safari), we just update the state.
        } else {
            moveItem(from, to)
        }
    }

    return (
        <Accordion className="mb-3">
            {structure.map(({ type: parentType, id, children }, index) => {
                const section = sections[parentType]
                const Icon = section.defaults.icon

                const currDragged =
                    draggingItem &&
                    (draggingItem.length > 1
                        ? draggingItem[draggingItem.length - 1]
                        : draggingItem[0])

                return (
                    <AccordionItem
                        key={parentType + index + id}
                        id={id || ''}
                        className={classNames(
                            'relative',
                            GROUP_VARIANTS[parentType][0]
                        )}
                        style={{
                            viewTransitionName: `card-${parentType}-${index}`,
                        }}>
                        {isDragging &&
                            draggingItem &&
                            !equalArrays(draggingItem, [
                                ...parentIndices,
                                index,
                            ]) &&
                            index === 0 && (
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
                            className="py-2 active:animate-pulse active:cursor-grabbing"
                            classNameButton={classNames({
                                'after:w-full': structure.length <= 1,
                                'after:w-[calc(100%-36px)]':
                                    structure.length > 1,
                            })}
                            {...dragProps([...parentIndices, index])}>
                            {structure.length > 1 && (
                                <GripDotsVertical
                                    size={16}
                                    className="mr-[16px] cursor-grab text-pzh-blue"
                                />
                            )}
                            <div
                                className={classNames(
                                    'flex h-[24px] w-[24px] items-center justify-center rounded-[4px] bg-pzh-warm-gray-light',
                                    GROUP_VARIANTS[parentType][1]
                                )}>
                                <Icon size={14} className="text-pzh-white" />
                            </div>
                            <Text
                                className="-mb-1 ml-[16px]"
                                color="text-pzh-blue">
                                {section.defaults.name} {index + 1}: {id}
                            </Text>
                        </AccordionTrigger>
                        <AccordionContent
                            className={
                                structure.length > 1 ? 'pl-[72px]' : 'pl-[40px]'
                            }>
                            {!!children?.length && (
                                <RecursiveAccordion
                                    structure={children}
                                    parentIndices={[...parentIndices, index]}
                                />
                            )}

                            {!!section.children?.length && (
                                <div className="flex items-center">
                                    <span className="text-[16px] text-pzh-blue">
                                        Invoegen in{' '}
                                        {section.defaults.demonstrative}{' '}
                                        {section.defaults.name.toLowerCase()}:
                                    </span>
                                    {section.children?.map(type => {
                                        const childSection = sections[type]

                                        return (
                                            <PillButton
                                                key={childSection.type}
                                                className="ml-[16px]"
                                                onPress={() =>
                                                    addItem(
                                                        [
                                                            ...parentIndices,
                                                            index,
                                                        ],
                                                        {
                                                            type,
                                                            id: `${parentType}.${index}.${type}.${
                                                                children?.length ||
                                                                0
                                                            }`,
                                                        }
                                                    )
                                                }>
                                                {childSection.defaults.name}
                                            </PillButton>
                                        )
                                    })}
                                </div>
                            )}
                        </AccordionContent>
                        {isDragging &&
                            draggingItem &&
                            !isNaN(currDragged || 0) &&
                            !equalArrays(draggingItem, [
                                ...parentIndices,
                                index,
                            ]) &&
                            // index + 1 !== structure.length &&
                            currDragged !== index + 1 && (
                                <DropArea
                                    position="bottom"
                                    onDrop={() =>
                                        handleDrop(draggingItem, [
                                            ...parentIndices,
                                            currDragged || 0 > index
                                                ? index + 1
                                                : index,
                                        ])
                                    }
                                />
                            )}
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

interface DropAreaProps {
    onDrop: () => void
    position: 'top' | 'bottom'
}

const DropArea = ({ onDrop, position }: DropAreaProps) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            onDragEnter={() => setIsVisible(true)}
            onDragLeave={() => setIsVisible(false)}
            onDrop={() => {
                onDrop()
                setIsVisible(false)
            }}
            onDragOver={ev => ev.preventDefault()}
            className={classNames(
                'after:content-[` `] absolute left-0 z-1 h-2 w-full py-2 transition-[opacity] after:absolute after:h-[4px] after:w-full after:animate-pulse after:bg-pzh-blue-light',
                {
                    '-top-2 after:top-[8px]': position === 'top',
                    '-bottom-2 after:bottom-[8px]': position === 'bottom',
                    'opacity-100': isVisible,
                    'opacity-0': !isVisible,
                }
            )}
        />
    )
}

export default RecursiveAccordion
