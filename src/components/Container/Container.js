import React from "react"

const Container = ({ children, style = {}, className = "" }) => {
    return (
        <div
            className={`pzh-container grid grid-cols-6 gap-x-10 gap-y-0 pr-4 mx-auto ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}

export default Container
