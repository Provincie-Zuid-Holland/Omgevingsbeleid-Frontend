import React from 'react'

function ViewFieldInnerHTML({ html }) {
    return (
        <div
            className="mb-8 raadpleeg-innerhtml"
            dangerouslySetInnerHTML={{ __html: html }}
        ></div>
    )
}

export default ViewFieldInnerHTML
