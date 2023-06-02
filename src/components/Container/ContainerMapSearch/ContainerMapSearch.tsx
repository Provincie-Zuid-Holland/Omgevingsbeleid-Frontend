import { FC } from 'react'

import useBreakpoint from '@/hooks/useBreakpoint'

interface ContainerMapSearchProps {
    id?: string
    className?: string
    reference?: string
}

const ContainerMapSearch: FC<ContainerMapSearchProps> = ({
    children,
    id = undefined,
    className = '',
    reference,
}) => {
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
