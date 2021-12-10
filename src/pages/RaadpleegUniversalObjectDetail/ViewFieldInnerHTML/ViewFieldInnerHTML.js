import React from "react"
import DOMPurify from "dompurify"

function ViewFieldInnerHTML({ html, fieldTitel }) {
    const cleanHtml = DOMPurify.sanitize(html)
    return (
        <div className="mb-8">
            {fieldTitel ? (
                <h2
                    className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue"
                    id={`raadpleeg-section-${fieldTitel
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                >
                    {fieldTitel}
                </h2>
            ) : null}
            <div
                className="w-full mb-8 leading-7 break-words whitespace-pre-line raadpleeg-innerhtml"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            ></div>
        </div>
    )
}

export default ViewFieldInnerHTML
