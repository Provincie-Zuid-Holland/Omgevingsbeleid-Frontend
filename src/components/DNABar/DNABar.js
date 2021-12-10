import React from "react"

import logoSVG from "./../../images/DNA_Balk.png"
import { useWindowSize } from "../../utils/useWindowSize"

function DNABar() {
    const windowSize = useWindowSize()

    return (
        <div
            className={`absolute top-0 pointer-events-none right-0 z-10 ${
                windowSize.width > 640 ? "" : "hidden"
            }`}
        >
            <img
                className="inline-block"
                title="Provincie Zuid-Holland Logo"
                style={{ width: windowSize.width < 768 ? 40 : 96 + "px" }}
                src={logoSVG}
                alt="Provincie Zuid-Holland Logo"
            />
        </div>
    )
}

export default DNABar
