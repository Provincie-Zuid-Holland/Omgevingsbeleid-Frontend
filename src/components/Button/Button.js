import React from "react"

function Button({ text, className = "" }) {
    return (
        <button
            className={`px-6 pt-2 pb-1 font-bold text-white transition-colors duration-100 ease-in rounded bg-pzh-blue hover:bg-pzh-blue-dark ${className}`}
        >
            {text}
        </button>
    )
}

export default Button
