import { CSSProperties, FC } from 'react'

interface ContainerProps {
    style?: CSSProperties
    id?: string
    className?: string
    reference?: string
}

const Container: FC<ContainerProps> = ({
    children,
    style = {},
    id = undefined,
    className = '',
    reference,
}) => {
    return (
        <div
            id={id}
            ref={reference}
            className={`pzh-container grid grid-cols-6 gap-x-10 gap-y-0 pr-4 mx-auto ${className}`}
            style={style}>
            {children}
        </div>
    )
}

export default Container
