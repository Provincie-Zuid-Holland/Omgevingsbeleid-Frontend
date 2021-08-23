import React from 'react'
import { faExternalLinkAlt } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ViewFieldExternalURL = ({ externalURL }) => {
    if (!externalURL) return null

    return (
        <a
            href={'//' + externalURL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 text-pzh-blue hover:text-pzh-blue-dark"
        >
            <span className="underline">Bekijk officiële publicatie</span>
            <FontAwesomeIcon
                className="relative ml-2"
                icon={faExternalLinkAlt}
            />
        </a>
    )
}

export default ViewFieldExternalURL
