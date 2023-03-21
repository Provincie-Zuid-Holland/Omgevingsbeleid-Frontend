import { ReactNode } from 'react'
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

const MutateLayout = ({ title, children }: MutateLayoutProps) => (
    <>
        <Helmet title={title} />

        <Container className="pt-10 pb-20">{children}</Container>
    </>
)

export default MutateLayout
