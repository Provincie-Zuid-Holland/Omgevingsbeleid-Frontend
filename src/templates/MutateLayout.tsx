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
}

const MutateLayout = ({ title, children, breadcrumbs }: MutateLayoutProps) => {
    const { isMobile } = useBreakpoint()

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

            {!editPage && !newPage && !isMobile && <Sidebar />}

            <div
                className={classNames('w-full', {
                    '-ml-[56px]': !editPage && !newPage && !isMobile,
                })}>
                {!!breadcrumbPaths?.length && (
                    <Container>
                        <div className="col-span-6 pt-8 pb-5">
                            <Breadcrumbs items={breadcrumbPaths} />
                        </div>
                    </Container>
                )}

                <Container
                    className={
                        !!breadcrumbPaths?.length ? 'pb-20' : 'pt-8 pb-20'
                    }>
                    {children}
                </Container>
            </div>
        </div>
    )
}

export default MutateLayout
