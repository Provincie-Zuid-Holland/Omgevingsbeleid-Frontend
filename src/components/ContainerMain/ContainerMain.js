import React from 'react'

// Pages met aparte container:
// /pages/Login
// /pages/MuteerUniversalObjectCRUD/ContainerMain
// /components/Navigation

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
