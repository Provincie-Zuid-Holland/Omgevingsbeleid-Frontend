import classNames from 'classnames'
import { DragControls, Reorder, useMotionValue } from 'framer-motion'
import { Fragment } from 'react'

import { VerordeningStructureChild } from '@/types/verordening'

import { useVerordening } from '../verordeningEditContext'

export interface ReorderItemProps {
    section: VerordeningStructureChild
    controls: DragControls
    children: JSX.Element
}

const ReorderItem = ({ section, controls, children }: ReorderItemProps) => {
    const { state, dispatch } = useVerordening()
    const { isEditingOrder, isLoadingOrSaving, activeChapterUUID } = state
    const y = useMotionValue(0)

    return (
        <Reorder.Item
            value={section}
            className={classNames({
                'py-2 pl-4 font-bold rounded bg-pzh-blue-super-light':
                    section.Type === 'Hoofdstuk',
                'cursor-pointer': !isEditingOrder && !activeChapterUUID,
            })}
            id={section.UUID}
            style={{ y }}
            dragListener={false}
            onClick={() => {
                if (
                    !isEditingOrder &&
                    !isLoadingOrSaving &&
                    !activeChapterUUID
                ) {
                    dispatch({
                        type: 'setActiveChapterUUID',
                        payload: section.UUID,
                    })
                }
            }}
            dragControls={controls}>
            <Fragment>{children}</Fragment>
        </Reorder.Item>
    )
}

export default ReorderItem
