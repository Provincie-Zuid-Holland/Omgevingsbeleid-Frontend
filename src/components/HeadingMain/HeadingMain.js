import React from "react"
import { faCubes } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/**
 * Component that renders the HeadingMain component displaying a titel and status.
 *
 * @param {string} titel - Parameter containing a titel displayed in h1 tag.
 * @param {string} status - Parameter containing the status Vigerend or Gepubliceerd.
 * @param {array|undefined} modules - Parameter containing the reference of modules the object is connected to
 */
const HeadingMain = ({ titel, status, modules }) => {
    return (
        <div className="relative">
            <h1 className="inline-block text-xl font-bold text-gray-800">
                <span className="mr-4">{titel}</span>
            </h1>
            {status && <BadgeStatus status={status} />}
            {modules && <BadgesModules modules={modules} />}
        </div>
    )
}

/**
 *
 * @param {string} status - The status
 * @returns A component displaying the current status
 */
const BadgeStatus = ({ status }) => {
    const isVigerend = status === "Vigerend"
    return (
        <span
            id="object-status"
            className={`inline-block font-bold mr-2 my-1 px-2 pt-1 text-xs border rounded ${
                isVigerend
                    ? "text-pzh-blue border-pzh-blue"
                    : "text-pzh-yellow-dark border-pzh-yellow-dark"
            }`}
        >
            {status}
        </span>
    )
}

/**
 *
 * @param {array} modules - Contains an array containing the modules this object is connected to
 * @returns A badge containing the modules Title for all the modules it is connected to
 */
const BadgesModules = ({ modules }) =>
    modules.map((module) => (
        <a
            key={module.Titel}
            href={`/muteer/beleidsmodules/${module.ID}`}
            target="_blank"
            rel="noreferrer"
            id="object-status"
            className={`inline-block font-bold mr-2 my-1 px-2 pt-1  text-xs border rounded text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white transition duration-100 ease-in`}
        >
            <FontAwesomeIcon className="mr-2" icon={faCubes} />
            {module.Titel}
        </a>
    ))

export default HeadingMain
