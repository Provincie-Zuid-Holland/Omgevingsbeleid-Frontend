import classNames from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Text } from '@pzh-ui/components'
import { House } from '@pzh-ui/icons'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false)

    let timer: number

    /**
     * Function to setExpanded to true after 750ms second of hovering
     */
    const endAndStartTimer = () => {
        window.clearTimeout(timer)

        timer = window.setTimeout(() => {
            setExpanded(true)
        }, 750)
    }

    return (
        <div
            className="sticky top-[97px] h-full w-14 whitespace-nowrap"
            onMouseLeave={() => {
                window.clearTimeout(timer)
                expanded && setExpanded(false)
            }}
            data-testid="sidebar">
            <div
                className={classNames(
                    'after:content-[" "] relative bg-pzh-gray-100 transition-[min-width] duration-200 ease-[cubic-bezier(.47,1.64,.41,.8)] after:absolute after:left-0 after:top-0 after:-z-1 after:h-[calc(100vh-97px)] after:w-full after:bg-pzh-gray-100 after:shadow-[0px_18px_60px_rgba(0,0,0,0.07),0px_4px_13px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.03)]',
                    {
                        'min-w-[56px]': !expanded,
                        'min-w-[260px]': expanded,
                    }
                )}>
                <div
                    className={classNames(
                        'grid grid-cols-1 gap-2 overflow-hidden px-2 py-12'
                    )}>
                    <MenuItem
                        name="Home"
                        path="/muteer"
                        icon={House}
                        expanded={expanded}
                        onHover={endAndStartTimer}
                        onClick={() => window.clearTimeout(timer)}
                    />

                    <div className="h-px w-full bg-pzh-blue" />

                    {Object.keys(models).map(key => {
                        const model = models[key as ModelType]
                        const { icon, plural, pluralCapitalize } =
                            model.defaults

                        const path = `/muteer/${plural}`

                        return (
                            <MenuItem
                                key={key}
                                name={pluralCapitalize}
                                path={path}
                                icon={icon}
                                expanded={expanded}
                                onHover={endAndStartTimer}
                                onClick={() => window.clearTimeout(timer)}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

interface MenuItemProps {
    name: string
    path: string
    icon: any
    expanded: boolean
    onHover: () => void
    onClick: () => void
}

const MenuItem = ({
    name,
    path,
    icon: Icon,
    expanded,
    onHover,
    onClick,
}: MenuItemProps) => {
    const pathname = location.pathname

    return (
        <Link
            to={path}
            className={classNames(
                'group flex h-10 items-center rounded px-2.5 hover:text-pzh-green',
                {
                    'bg-pzh-gray-200 text-pzh-green': path === pathname,
                    'w-10': !expanded,
                }
            )}
            onMouseEnter={!expanded ? onHover : undefined}
            onClick={onClick}
            data-testid="sidebar-item">
            <Icon size={20} className="min-w-[20px]" />
            <Text
                className={classNames(
                    '-mb-0.5 ml-2 group-hover:text-pzh-green',
                    {
                        'opacity-0': !expanded,
                        'text-pzh-green': path === pathname,
                    }
                )}>
                {name}
            </Text>
        </Link>
    )
}

export default Sidebar
