import React from "react"

const Heading = ({ type, titel, id = null }) => {
    return (
        <React.Fragment>
            <span className="block mb-2 text-xl font-bold opacity-25 text-pzh-blue">
                {type}
            </span>
            <h1 id={id} className="mt-1 text-4xl font-bold text-pzh-blue ">
                {titel}
            </h1>
        </React.Fragment>
    )
}

export default Heading