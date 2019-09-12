import React from 'react'

function ContainerMain(props) {
    return (
        <div className="container mx-auto flex px-6 pb-8">{props.children}</div>
    )
}

export default ContainerMain
