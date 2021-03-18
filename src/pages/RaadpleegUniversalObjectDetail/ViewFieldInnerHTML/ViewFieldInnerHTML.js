import React from 'react'
import DOMPurify from 'dompurify'

function ViewFieldInnerHTML({ html }) {
    const cleanHtml = DOMPurify.sanitize(html)
    return (
        <div
            className="mb-8 raadpleeg-innerhtml"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        ></div>
    )
}

export default ViewFieldInnerHTML
