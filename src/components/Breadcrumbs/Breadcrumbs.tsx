import { AngleRight } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

type BreadcrumbsProps = {
    className?: string
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
        <nav aria-label="Breadcrumb" className={className + ' text-pzh-blue'}>
            <ol className="flex">
                {paths.map((item, index) => {
                    return index === paths.length - 1 ? (
                        <li key={item.name} className="inline-block">
                            <Link aria-current="page" to={item.path}>
                                {item.name}
                            </Link>
                        </li>
                    ) : (
                        <li
                            key={item.name}
                            className="inline-block mr-2 font-bold">
                            <Link to={item.path}>{item.name}</Link>
                            <AngleRight className="ml-2 -mt-[2px] sr-hidden inline-block" />
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
