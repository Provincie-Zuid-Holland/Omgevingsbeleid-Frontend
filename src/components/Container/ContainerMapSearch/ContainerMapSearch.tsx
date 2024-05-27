import classNames from 'clsx'
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
            className={classNames(
                'mx-auto flex flex-col md:flex-row',
                {
                    'h-[calc(100vh-96px)]': !isMobile,
                },
                className
            )}>
            {children}
        </div>
    )
}

export default ContainerMapSearch
