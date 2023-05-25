import { Breadcrumbs } from '@pzh-ui/components'
import { ReactNode, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'

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
        <>
            <Helmet title={title} />

            {!!breadcrumbPaths?.length && (
                <Container>
                    <div className="col-span-6 pt-8 pb-5">
                        <Breadcrumbs items={breadcrumbPaths} />
                    </div>
                </Container>
            )}

            <Container
                className={!!breadcrumbPaths?.length ? 'pb-20' : 'pt-8 pb-20'}>
                {children}
            </Container>
        </>
    )
}

export default MutateLayout
