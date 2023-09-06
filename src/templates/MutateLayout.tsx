import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { Breadcrumbs } from '@pzh-ui/components'

import { Container } from '@/components/Container'
import RegulationSidebar from '@/components/Regulations/Sidebar'
import Sidebar from '@/components/Sidebar'
import useBreakpoint from '@/hooks/useBreakpoint'
import usePage from '@/hooks/usePage'

interface MutateLayoutProps {
    title?: string
    children: ReactNode | ReactNode[]
    breadcrumbs?: {
        name: string
        path?: string
        isCurrent?: boolean
    }[]
    hasOwnBreadcrumbs?: boolean
}

const MutateLayout = ({
    title,
    children,
    breadcrumbs,
    hasOwnBreadcrumbs,
}: MutateLayoutProps) => {
    const { isDesktop } = useBreakpoint()

    const editPage = usePage('/bewerk')
    const newPage = usePage('/nieuw')
    const regulationPage = usePage('/verordening')

    const pathName = location.pathname || ''

    const breadcrumbPaths = useMemo(
        () =>
            breadcrumbs?.map(breadcrumb => ({
                name: breadcrumb?.name,
                path: breadcrumb?.isCurrent ? pathName : breadcrumb?.path || '',
            })),
        [breadcrumbs, pathName]
    )

    const hasSidebar = !editPage && !newPage && !regulationPage && isDesktop

    return (
        <div className="flex">
            <Helmet title={title} />

            {hasSidebar && <Sidebar />}
            {regulationPage && <RegulationSidebar />}

            <div
                className={classNames('w-full', {
                    '-ml-[56px]': hasSidebar,
                })}>
                {!!breadcrumbPaths?.length && (
                    <Container>
                        <div className="col-span-6 pb-5 pt-6">
                            <Breadcrumbs items={breadcrumbPaths} />
                        </div>
                    </Container>
                )}

                <Container
                    className={classNames('pb-20', {
                        'pt-10':
                            !!!breadcrumbPaths?.length && !hasOwnBreadcrumbs,
                        'pt-6': hasOwnBreadcrumbs,
                    })}>
                    {children}
                </Container>
            </div>
        </div>
    )
}

export default MutateLayout
