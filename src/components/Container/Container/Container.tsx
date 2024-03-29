import { CSSProperties, MutableRefObject, ReactNode } from 'react'

interface ContainerProps<T = any> {
    children: ReactNode
    style?: CSSProperties
    id?: string
    className?: string
    reference?: MutableRefObject<T>
}

const Container = ({
    children,
    style = {},
    id = undefined,
    className = '',
    reference,
}: ContainerProps) => {
    return (
        <div
            id={id}
            ref={reference}
            className={`pzh-container mx-auto grid grid-cols-6 gap-x-10 gap-y-0 pr-4 ${className}`}
            style={style}>
            {children}
        </div>
    )
}

export default Container
