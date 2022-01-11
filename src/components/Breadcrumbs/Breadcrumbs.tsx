import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons"
import { Link } from "react-router-dom"

type BreadcrumbsProps = {
    className: string
    paths: { name: string; path: string }[]
}

/**
 *
 * @param {object} props
 * @param {string} props.className - className to add to the component
 * @param {array} props.paths - breadcrumb items
 * @returns A component that display a breadrumb to the current page
 */
function Breadcrumbs({ className, paths = [] }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={className + " text-pzh-blue"}>
            <ol className="flex">
                {paths.map((item, index) => {
                    return index === paths.length - 1 ? (
                        <li className="inline-block">
                            <Link aria-current="page" to={item.path}>
                                {item.name}
                            </Link>
                        </li>
                    ) : (
                        <li className="inline-block mr-2 font-bold">
                            <Link to={item.path}>{item.name}</Link>
                            <FontAwesomeIcon
                                aria-hidden={true}
                                icon={faAngleRight}
                                className="ml-2 sr-hidden"
                            />
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
