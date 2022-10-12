import { Reorder } from 'framer-motion'
import { FC, Fragment } from 'react'

import { useVerordening } from '../verordeningEditContext'

export interface ReorderGroupProps {
    values: unknown[]
    indexPath: number[]
    parentType: string | null
    replaceUlForFragment?: boolean
}

const ReorderGroup: FC<ReorderGroupProps> = ({
    values,
    indexPath,
    replaceUlForFragment,
    parentType,
    children,
}) => {
    const { dispatch } = useVerordening()
    if (replaceUlForFragment) {
        return <Fragment>{children}</Fragment>
    } else {
        // Leden (children of Artikel) shouldn't be indented anymore than the parent
        const paddingLeft =
            parentType === 'Artikel'
                ? indexPath.length * 2 - 2
                : indexPath.length * 2

        return (
            <Reorder.Group
                axis="y"
                className={`space-y-2 my-4 pl-${paddingLeft}`}
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
