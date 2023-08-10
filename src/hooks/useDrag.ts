import { HTMLAttributes, useRef, useState } from 'react'

interface DragOptions {
    /** Wether the element is draggable */
    draggable?: boolean
    /** Handler that is called when a drag operation is started. */
    onDragStart?: (id: number[] | null) => void
    /** Handler that is called when the drag operation is ended, either as a result of a drop or a cancellation. */
    onDragEnd?: () => void
}

interface DragResult {
    /** Props for the draggable element. */
    dragProps: (id: number[] | null) => HTMLAttributes<HTMLElement>
    /** Whether the element is currently being dragged. */
    isDragging: boolean
}

const useDrag = (options: DragOptions): DragResult => {
    const isDraggingRef = useRef(false)
    const [isDragging, setDraggingState] = useState(false)

    const setDragging = (isDragging: boolean) => {
        isDraggingRef.current = isDragging
        setDraggingState(isDragging)
    }

    const onDragStart = (id: number[] | null) => {
        if (typeof options.onDragStart === 'function') {
            options.onDragStart(id)
        }

        requestAnimationFrame(() => {
            setDragging(true)
        })
    }

    const onDragEnd = () => {
        if (typeof options.onDragEnd === 'function') {
            options.onDragEnd()
        }

        setDragging(false)
    }

    return {
        isDragging,
        dragProps: id => ({
            draggable: options.draggable,
            onDragStart: ev => {
                onDragStart(id)

                // This enables the dragging functionality on iOS too.
                ev.dataTransfer.setData('text/html', ev.currentTarget.outerHTML)
            },
            onDragEnd,
        }),
    }
}

export default useDrag
