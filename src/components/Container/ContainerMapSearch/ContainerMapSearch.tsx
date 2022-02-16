import { CSSProperties, FC } from 'react'

interface ContainerMapSearchProps {
    style?: CSSProperties
    id?: string
    className?: string
    reference?: string
}

const ContainerMapSearch: FC<ContainerMapSearchProps> = ({
    children,
    style = {},
    id = undefined,
    className = '',
    reference,
}) => (
    <div
        id={id}
        ref={reference}
        className={`min-h-944 flex mx-auto ${className}`}
        style={style}>
        {children}
    </div>
)

export default ContainerMapSearch
