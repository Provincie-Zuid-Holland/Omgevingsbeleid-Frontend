import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Text from "./../../../components/Text"

const DocumentLink = ({ href, title, iconLeft, className = "" }) => (
    <li
        className={`pb-2 transition-colors duration-100 ease-in text-pzh-green ${className}`}
    >
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between"
        >
            <div className="flex">
                <span className="flex items-center">
                    <FontAwesomeIcon icon={iconLeft} />
                </span>
                <Text
                    color="text-pzh-green"
                    className="ml-2 underline"
                    type="body"
                >
                    {title}
                </Text>
            </div>
        </a>
    </li>
)

export default DocumentLink
