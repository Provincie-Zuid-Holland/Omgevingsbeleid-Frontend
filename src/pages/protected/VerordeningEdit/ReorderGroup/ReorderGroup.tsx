import classNames from 'classnames'
import { Reorder } from 'framer-motion'
import { FC, Fragment } from 'react'

import { useVerordening } from '../verordeningEditContext'

export interface ReorderGroupProps {
    values: unknown[]
    indexPath: number[]
    replaceUlForFragment?: string | null
}

const ReorderGroup: FC<ReorderGroupProps> = ({
    values,
    indexPath,
    replaceUlForFragment,
    children,
}) => {
    const { dispatch } = useVerordening()
    if (replaceUlForFragment) {
        return <Fragment>{children}</Fragment>
    } else {
        return (
            <Reorder.Group
                axis="y"
                className={`space-y-2 my-4 pl-${indexPath.length * 2}`}
                onReorder={reorderedSections => {
                    dispatch({
                        type: 'reorderSections',
                        payload: { reorderedSections, indexPath },
                    })
                }}
                values={values}>
                {children}
            </Reorder.Group>
        )
    }
}

export default ReorderGroup
