import React from 'react'
import { Link } from 'react-router-dom'

const NetworkGraphTooltip = ({ variables, setGraphIsOpen, href }) => {
    return (
        <div
            id="d3-tooltip-network-graph"
            style={{
                left: variables.left,
                top: variables.top,
            }}
            className="absolute z-50 hidden px-4 py-2 bg-white rounded shadow-md hover:block"
        >
            <Link
                onClick={(e) => {
                    if (!e.metaKey) {
                        setGraphIsOpen(false)
                    }
                }}
                to={href}
                className="select-none group"
                role="tooltip"
            >
                <div
                    id="d3-tooltip-network-graph-type"
                    className={`text-gray-600`}
                />
                <div
                    id="d3-tooltip-network-graph-title"
                    className={`text-pzh-blue-dark group-hover:underline truncate`}
                    style={{ maxWidth: '400px' }}
                />
            </Link>
        </div>
    )
}

export default NetworkGraphTooltip
