import { FC } from 'react'

interface TableDataCell {
    className?: string
}

/**
 *
 * @param {object} props
 * @param {string} props.className - Contains potential custom classNames
 * @param {object} props.children - Contains child components
 * @returns A <td> element
 */
const TableDataCell: FC<TableDataCell> = ({ className = '', children }) => (
    <td
        className={`px-3 py-3 text-sm text-gray-800 whitespace-nowrap ${className}`}>
        {children}
    </td>
)

export default TableDataCell
