import { FC } from 'react'

interface TableHeadingProps {
    property?: string
    sorting?: {
        activeSorting: string
    }
    setSorting?: (arg0: { type: string; property: string }) => void
    label: string
    noIcon?: boolean
}

/**
 *
 * @param {object} props
 * @param {string} props.property - Contains the sorting property
 * @param {object} props.sorting - Contains the sorting state
 * @param {function} props.setSorting - Function to update the sorting state
 * @param {string} props.label - Label
 * @param {object} props.children - Contains child components
 * @param {boolean} props.noIcon - Boolean indicating if the <th> element will contain no icon
 * @returns A <th> element
 */
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
