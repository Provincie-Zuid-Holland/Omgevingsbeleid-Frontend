import React from "react"

import logoSVG from "./../../images/DNA_Balk.png"
import { useWindowSize } from "../../utils/useWindowSize"

function DNABar() {
    const [offsetY, setOffsetY] = React.useState(0)

    const windowSize = useWindowSize()

    // Give DNABar an y-offset of the height of the Navigationbar
    React.useEffect(() => {
        const navigationID = "navigation-main"
        const navigationEl = document.getElementById(navigationID)
        if (!navigationEl) return
        const navigationHeight = navigationEl.offsetHeight
        setOffsetY(navigationHeight)
    }, [])

    return (
        <div
            className="absolute top-0 right-0 z-10"
            style={{ marginTop: offsetY }}
        >
            <img
                className="inline-block"
                title="Provincie Zuid-Holland Logo"
                style={{ width: windowSize.width <= 768 ? 40 : 96 + "px" }}
                src={logoSVG}
                alt="Provincie Zuid-Holland Logo"
            />
        </div>
    )
}

export default DNABar
