import React from 'react'

// Pages met aparte container:
// /pages/Login
// /pages/MuteerUniversalObjectCRUD/ContainerMain
// /components/Navigation

/**
 * Component that shows the content based on the given id from props.
 *
 * @component
 *
 * @param {props} props - Parameter containing a certain value that can be used within the function.
 */

function ContainerMain(props) {
    return props.id ? (
        <div
            className="container flex pb-8 mx-auto sm:px-6 lg:px-8"
            id={props.id}
        >
            {props.children}
        </div>
    ) : (
        <div className="container flex pb-8 mx-auto sm:px-6 lg:px-8">
            {props.children}
        </div>
    )
}

export default ContainerMain
