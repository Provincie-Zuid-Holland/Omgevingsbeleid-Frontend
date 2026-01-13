import { Text } from '@pzh-ui/components'
import {
    FileImport,
    FileInvoice,
    House,
    LayerGroupLight,
    Users,
} from '@pzh-ui/icons'
import classNames from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'

const Sidebar = () => {
    const {
        canEditUser,
        canViewPublicationTemplate,
        canViewPublicationPackage,
    } = usePermissions()

    const [expanded, setExpanded] = useState(false)

    const timerRef = useRef<number | null>(null)

    const startHoverTimer = () => {
        if (timerRef.current) window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => setExpanded(true), 750)
    }

    const clearHoverTimer = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    const location = useLocation()
    useEffect(() => {
        clearHoverTimer()
        setExpanded(false)
    }, [location.pathname])

    return (
        <div
            className="sticky top-[97px] z-[1] h-full w-14 whitespace-nowrap"
            onMouseLeave={() => {
                clearHoverTimer()
                if (expanded) setExpanded(false)
            }}
            data-testid="sidebar">
            <div
                className={classNames(
                    'after:content-[" "] bg-pzh-gray-100 after:bg-pzh-gray-100 relative transition-[min-width] duration-200 ease-[cubic-bezier(.47,1.64,.41,.8)] after:absolute after:top-0 after:left-0 after:-z-[1] after:h-[calc(100vh-97px)] after:w-full after:shadow-[0px_18px_60px_rgba(0,0,0,0.07),0px_4px_13px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.03)]',
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
                        onHover={startHoverTimer}
                        onClick={clearHoverTimer}
                    />

                    <div className="bg-pzh-blue-500 h-px w-full" />

                    <MenuItem
                        name="Modules"
                        path="/muteer/modules"
                        icon={LayerGroupLight}
                        expanded={expanded}
                        onHover={startHoverTimer}
                        onClick={clearHoverTimer}
                    />

                    <div className="bg-pzh-blue-500 h-px w-full" />

                    {Object.keys(models).map(key => {
                        const model = models[key as ModelType]
                        const { icon, plural, pluralCapitalize } =
                            model.defaults

                        const path = `/muteer/${plural}`

                        if (model.defaults.disabled) return null

                        return (
                            <MenuItem
                                key={key}
                                name={pluralCapitalize}
                                path={path}
                                icon={icon}
                                expanded={expanded}
                                onHover={startHoverTimer}
                                onClick={clearHoverTimer}
                            />
                        )
                    })}

                    {(canViewPublicationTemplate ||
                        canViewPublicationPackage) && (
                        <>
                            <div className="bg-pzh-blue-500 h-px w-full" />
                            {canViewPublicationPackage && (
                                <MenuItem
                                    name="Leveringen"
                                    path="/muteer/leveringen"
                                    icon={FileImport}
                                    expanded={expanded}
                                    onHover={startHoverTimer}
                                    onClick={clearHoverTimer}
                                />
                            )}
                            {canViewPublicationTemplate && (
                                <MenuItem
                                    name="Publicatietemplates"
                                    path="/muteer/publicatietemplates"
                                    icon={FileInvoice}
                                    expanded={expanded}
                                    onHover={startHoverTimer}
                                    onClick={clearHoverTimer}
                                />
                            )}
                        </>
                    )}

                    {canEditUser && (
                        <>
                            <div className="bg-pzh-blue-500 h-px w-full" />
                            <MenuItem
                                name="Gebruikers"
                                path="/muteer/gebruikers"
                                icon={Users}
                                largerIcon
                                expanded={expanded}
                                onHover={startHoverTimer}
                                onClick={clearHoverTimer}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

interface MenuItemProps {
    name: string
    path: string
    icon: any
    largerIcon?: boolean
    expanded: boolean
    onHover: () => void
    onClick: () => void
}

const MenuItem = ({
    name,
    path,
    icon: Icon,
    largerIcon,
    expanded,
    onHover,
    onClick,
}: MenuItemProps) => {
    const pathname = location.pathname

    return (
        <Link
            to={path}
            className={classNames(
                'group hover:text-pzh-green-500 flex h-10 items-center rounded',
                {
                    'bg-pzh-gray-200 text-pzh-green-500':
                        path === pathname ||
                        (path !== '/muteer' && pathname.startsWith(path)),
                    'w-10': !expanded,
                    'px-2.5': !largerIcon,
                    'px-2': largerIcon,
                }
            )}
            onMouseEnter={!expanded ? onHover : undefined}
            onClick={onClick}
            data-testid="sidebar-item">
            <Icon
                size={largerIcon ? 25 : 20}
                className={classNames({
                    'min-w-[20px]': !largerIcon,
                    'min-w-[25px]': largerIcon,
                })}
            />
            <Text
                className={classNames(
                    'group-hover:text-pzh-green-500 -mb-0.5 ml-2',
                    {
                        'opacity-0': !expanded,
                        'text-pzh-green-500': path === pathname,
                    }
                )}>
                {name}
            </Text>
        </Link>
    )
}

export default Sidebar
