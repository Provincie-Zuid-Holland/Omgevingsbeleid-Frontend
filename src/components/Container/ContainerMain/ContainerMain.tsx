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

const ContainerMain: FC<ContainerProps> = ({ id, className, children }) => {
    return (
        <div
            className={`container flex pb-8 mx-auto sm:px-6 lg:px-8 ${
                className ? className : ''
            }`}
            id={id}>
            {children}
        </div>
    )
}

export default ContainerMain
