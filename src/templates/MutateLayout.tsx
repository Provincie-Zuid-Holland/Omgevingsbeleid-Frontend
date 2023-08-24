import { Breadcrumbs } from '@pzh-ui/components'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
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

    const pathName = location.pathname || ''

    const breadcrumbPaths = useMemo(
        () =>
            breadcrumbs?.map(breadcrumb => ({
                name: breadcrumb?.name,
                path: breadcrumb?.isCurrent ? pathName : breadcrumb?.path || '',
            })),
        [breadcrumbs, pathName]
    )

    return (
        <div className="flex">
            <Helmet title={title} />

            {!editPage && !newPage && isDesktop && <Sidebar />}

            <div
                className={classNames('w-full', {
                    '-ml-[56px]': !editPage && !newPage && isDesktop,
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
