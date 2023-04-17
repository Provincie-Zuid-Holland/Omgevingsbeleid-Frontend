import { Heading, HeadingProps } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useState } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

interface SubNavigationProps {
    ariaLabel: string
    className?: string
    children: React.ReactNode
}

interface SubNavigationHeaderProps {
    children: React.ReactNode
    as?: HeadingProps['as']
}

interface SubNavigationListProps {
    children: React.ReactNode
}

interface SubNavigationLinkProps
    extends Exclude<NavLinkProps, 'className' | 'children'> {
    label: string | React.ReactNode
}

/**
 * @example
 *  <SubNavigation ariaLabel="Subnavigation">
 *    <SubNavigation.Header>Subnavigation header</SubNavigation.Header>
 *    <SubNavigation.List>
 *      <SubNavigation.Link to="/path/to/page" label="Link label" />
 *   </SubNavigation.List>
 * </SubNavigation>
 */
const SubNavigation = ({
    ariaLabel,
    className,
    children,
}: SubNavigationProps) => {
    return (
        <nav className={className} aria-label={ariaLabel}>
            {children}
        </nav>
    )
}

SubNavigation.Header = function Header({
    children,
    as = '3',
}: SubNavigationHeaderProps) {
    return (
        <Heading className="mt-4 first:mt-0 mb-1" as={as} level="4">
            {children}
        </Heading>
    )
}

SubNavigation.List = function List({ children }: SubNavigationListProps) {
    return <ul>{children}</ul>
}

SubNavigation.Link = function Link({
    label,
    ...props
}: SubNavigationLinkProps) {
    return (
        <li className="border-t last:border-b">
            <NavLink
                className="group flex justify-between items-center p-1 hover:bg-gray-200 [&.active]:bg-gray-200"
                {...props}>
                <span>{label}</span>

                <AngleRight className="ml-2 mr-1 shrink-0 transition-transform group-hover:translate-x-1" />
            </NavLink>
        </li>
    )
}

export default SubNavigation
