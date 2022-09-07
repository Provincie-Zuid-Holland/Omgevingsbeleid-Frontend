import classNames from 'classnames'
import { FC } from 'react'

/**
 * Pages met aparte container:
 * /pages/Login
 * /pages/MuteerUniversalObjectCRUD/ContainerMain
 * /components/Navigation
 * */

/**
 * Displays either a container with or without an id.
 */

interface ContainerProps {
    id?: string
    className?: string
}

const ContainerMain: FC<ContainerProps> = ({ id, children, className }) => {
    if (id)
        return (
            <div
                className={classNames(
                    `container flex pb-8 mx-auto sm:px-6 lg:px-8`,
                    {
                        className,
                    }
                )}
                id={id}>
                {children}
            </div>
        )

    return (
        <div className="container flex pb-8 mx-auto sm:px-6 lg:px-8">
            {children}
        </div>
    )
}

export default ContainerMain
