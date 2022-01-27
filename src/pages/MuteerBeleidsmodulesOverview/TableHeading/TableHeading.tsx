import { FC } from 'react'

interface TableHeadingProps {
    property?: string
    sorting?: {
        activeSorting: string
    }
    setSorting?: (object: { type: string; property: string }) => void
    label: string
    noIcon?: boolean
}

const TableHeading: FC<TableHeadingProps> = ({
    property,
    sorting,
    setSorting,
    label,
    children,
    noIcon,
}) => {
    return (
        <th
            scope="col"
            className={`px-3 py-3 text-sm font-medium whitespace-nowrap tracking-wider text-left text-gray-700 select-none ${
                noIcon ? '' : 'cursor-pointer hover:text-gray-800'
            }`}
            onClick={() => {
                if (noIcon || !sorting || !setSorting || !property) return

                if (sorting.activeSorting === property) {
                    setSorting({
                        type: 'toggle',
                        property,
                    })
                } else {
                    setSorting({
                        type: 'reactivate',
                        property,
                    })
                }
            }}>
            {label}
            {children}
        </th>
    )
}

export default TableHeading
