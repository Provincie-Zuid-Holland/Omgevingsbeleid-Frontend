import React from 'react'

const TableDataCell = ({ className, children }) => (
    <td
        className={`px-3 py-3 text-sm text-gray-800 whitespace-nowrap ${
            className ? className : ''
        }`}
    >
        {children}
    </td>
)

export default TableDataCell
