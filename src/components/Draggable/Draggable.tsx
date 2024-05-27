import classNames from 'clsx'
import { ArrayHelpers } from 'formik'
import { ElementType, cloneElement } from 'react'

import { DragResult } from '@/hooks/useDrag'
import useRegulationStore from '@/store/regulationStore'
import equalArrays from '@/utils/equalArrays'
import handleViewTransition from '@/utils/handleViewTransition'

import DropArea from '../DropArea'

interface DraggableProps extends DragResult {
    as?: ElementType
    children: JSX.Element
    index: number
    arrayHelpers: ArrayHelpers
    className?: string
}

const Draggable = ({
    as: Wrapper = 'div',
    children,
    index,
    arrayHelpers,
    isDragging,
    dragProps,
    className,
}: DraggableProps) => {
    const draggingItem = useRegulationStore(state => state.draggingItem)

    const currDragged = draggingItem && draggingItem[draggingItem.length - 1]
    const isDraggingAndValid =
        isDragging && draggingItem && !equalArrays(draggingItem, [index])

    const showTopDropArea = isDraggingAndValid && index === 0
    const showBottomDropArea = isDraggingAndValid && currDragged !== index + 1

    return (
        <Wrapper className={classNames('relative', className)}>
            {showTopDropArea && draggingItem && (
                <DropArea
                    position="top"
                    onDrop={() =>
                        handleViewTransition(() =>
                            arrayHelpers.move(draggingItem[0], index)
                        )
                    }
                    className="-top-5 py-4 after:-mt-0.5"
                />
            )}
            {cloneElement(children, {
                dragOptions: {
                    ...dragProps([index]),
                },
            })}
            {showBottomDropArea && draggingItem && (
                <DropArea
                    position="bottom"
                    onDrop={() =>
                        handleViewTransition(() =>
                            arrayHelpers.move(
                                draggingItem[0],
                                (currDragged || 0) > index ? index + 1 : index
                            )
                        )
                    }
                    className="-bottom-5 py-4 after:-mt-0.5"
                />
            )}
        </Wrapper>
    )
}

export default Draggable
