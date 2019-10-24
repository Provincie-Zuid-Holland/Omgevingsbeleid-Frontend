import React from 'react'

// Pages met aparte container:
// /pages/Login
// /pages/MuteerUniversalObjectCRUD/ContainerMain
// /components/Navigation

function ContainerMain(props) {
    return props.id ? (
        <div className="lg:px-10 container mx-auto flex pb-8" id={props.id}>
            {props.children}
        </div>
    ) : (
        <div className="lg:px-10 container mx-auto flex pb-8">
            {props.children}
        </div>
    )
}

export default ContainerMain
