import { FC } from 'react'

const TableDataCell: FC<{ className?: string }> = ({
    className = '',
    children,
}) => (
    <td
        className={`px-3 py-3 text-sm text-gray-800 whitespace-nowrap ${className}`}>
        {children}
    </td>
)

export default TableDataCell
