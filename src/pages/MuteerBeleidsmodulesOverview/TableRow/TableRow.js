import React from "react"
import { Link } from "react-router-dom"

import TableDataCell from "./../TableDataCell"

import * as MAATREGELEN from "./../../../constants/maatregelen"
import * as BELEIDSKEUZES from "./../../../constants/beleidskeuzes"

/**
 *
 * @param {object} policy - Contains the policy object
 * @returns A <tr> element containing information about the policy object
 */
const TableRow = ({ policy }) => (
    <tr key={policy.Object.UUID}>
        <TableDataCell>{policy.Object.Titel}</TableDataCell>
        <TableDataCell>
            {policy.Object.hasOwnProperty("Aanleiding")
                ? "Beleidskeuze"
                : "Maatregel"}
        </TableDataCell>
        <TableDataCell>{policy.Object.Status}</TableDataCell>
        <TableDataCell>
            <Link
                className="hover:text-gray-900 hover:underline"
                to={`/muteer/${
                    policy.Object.hasOwnProperty("Aanleiding")
                        ? BELEIDSKEUZES.SLUG_OVERVIEW
                        : MAATREGELEN.SLUG_OVERVIEW
                }/${policy.Object.ID}`}
            >
                {policy.Object.UUID}
            </Link>
        </TableDataCell>
        <TableDataCell>
            {new Intl.DateTimeFormat("nl-NL", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(policy.Object.Modified_Date))}
        </TableDataCell>
    </tr>
)

export default TableRow
