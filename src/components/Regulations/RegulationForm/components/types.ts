import { CSSProperties, HTMLAttributes } from 'react'

export interface RegulationFieldProps {
    label?: string
    name: string
    index: number
    parentIndex?: number
    handleRemove: () => void
    isGroup?: boolean
    isDraggable?: boolean
    style?: CSSProperties
    dragOptions?: HTMLAttributes<HTMLElement>
}
