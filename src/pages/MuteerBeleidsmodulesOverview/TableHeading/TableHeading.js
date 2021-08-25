import React from "react"

const TableHeading = ({
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
            className={`px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800 select-none ${
                noIcon ? "" : "cursor-pointer hover:text-gray-900"
            }`}
            onClick={() => {
                if (noIcon) return

                if (sorting.activeSorting === property) {
                    setSorting({
                        type: "toggle",
                        property: property,
                    })
                } else {
                    setSorting({
                        type: "reactivate",
                        property: property,
                    })
                }
            }}
        >
            {label}
            {children}
        </th>
    )
}

export default TableHeading
