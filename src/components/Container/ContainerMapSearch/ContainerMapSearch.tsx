import { ReactNode } from 'react'

import useBreakpoint from '@/hooks/useBreakpoint'

interface ContainerMapSearchProps {
    children: ReactNode
    id?: string
    className?: string
    reference?: string
}

const ContainerMapSearch = ({
    children,
    id = undefined,
    className = '',
    reference,
}: ContainerMapSearchProps) => {
    const { isMobile } = useBreakpoint()

    return (
        <div
            id={id}
            ref={reference}
            className={`flex flex-col md:flex-row mx-auto ${className}`}
            style={!isMobile ? { height: 'calc(100vh - 96px' } : undefined}>
            {children}
        </div>
    )
}

export default ContainerMapSearch
