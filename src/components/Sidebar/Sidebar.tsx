import { Text } from '@pzh-ui/components'
import { House } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false)

    let timer: number

    const endAndStartTimer = () => {
        window.clearTimeout(timer)

        timer = window.setTimeout(() => {
            setExpanded(true)
        }, 1000)
    }

    return (
        <div
            className={classNames(
                'sticky top-[97px] h-full w-[56px] whitespace-nowrap'
            )}
            onMouseLeave={() => {
                window.clearTimeout(timer)
                expanded && setExpanded(false)
            }}>
            <div
                className={classNames(
                    'relative bg-pzh-gray-100 transition-[min-width] ease-[cubic-bezier(.47,1.64,.41,.8)] duration-200 after:shadow-[0px_18px_60px_rgba(0,0,0,0.07),0px_4px_13px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.03)] after:content-[" "] after:-z-1 after:absolute after:top-0 after:left-0 after:w-full after:h-[calc(100vh-97px)] after:bg-pzh-gray-100',
                    {
                        'min-w-[56px]': !expanded,
                        'min-w-[260px]': expanded,
                    }
                )}>
                <div
                    className={classNames(
                        'grid grid-cols-1 gap-2 py-[48px] px-[8px] overflow-hidden'
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
                'group flex items-center h-8 px-2 rounded-[4px] hover:text-pzh-green',
                {
                    'bg-pzh-gray-200 text-pzh-green': path === pathname,
                    'w-8': !expanded,
                }
            )}
            onMouseEnter={onHover}
            onClick={onClick}>
            <Icon size={20} className="min-w-[20px]" />
            <Text
                className={classNames(
                    'ml-2 -mb-0.5 group-hover:text-pzh-green',
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
