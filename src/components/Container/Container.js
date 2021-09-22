import React from "react"

const Container = ({
    children,
    style = {},
    className = "",
    widthFull,
    reference,
}) => {
    return (
        <div
            ref={reference}
            className={`pzh-container grid grid-cols-6 gap-x-10 gap-y-0 pr-4 mx-auto ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}

export default Container
