import classNames from 'clsx'
import { ReactNode, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

import Breadcrumbs from '@/components/Breadcrumbs'
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
    className?: string
}

const MutateLayout = ({
    title,
    children,
    breadcrumbs,
    hasOwnBreadcrumbs,
    className,
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
                to: breadcrumb?.isCurrent ? pathName : breadcrumb?.path || '',
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
                    '-ml-14': hasSidebar,
                })}>
                {!!breadcrumbPaths?.length && (
                    <Container>
                        <div className="col-span-6 pt-10">
                            <Breadcrumbs items={breadcrumbPaths} />
                        </div>
                    </Container>
                )}

                <Container
                    className={classNames(
                        'pb-20',
                        {
                            'pt-12':
                                !!!breadcrumbPaths?.length &&
                                !hasOwnBreadcrumbs,
                            'pt-10': hasOwnBreadcrumbs,
                            'pt-6': !!breadcrumbPaths?.length,
                        },
                        className
                    )}>
                    {children}
                </Container>
            </div>
        </div>
    )
}

export default MutateLayout
