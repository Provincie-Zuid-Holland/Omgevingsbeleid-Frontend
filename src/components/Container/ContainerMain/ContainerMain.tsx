import classNames from 'classnames'
import { FC } from 'react'

/**
 * Displays either a container with or without an id.
 */

interface ContainerProps {
    id?: string
    className?: string
}

const ContainerMain: FC<ContainerProps> = ({ id, children, className }) => {
    return (
        <div
            id={id}
            className={classNames(
                `container flex pb-8 mx-auto sm:px-6 lg:px-8`,
                className
            )}>
            {children}
        </div>
    )
}

export default ContainerMain
