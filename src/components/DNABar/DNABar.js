import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import logoSVG from './../../images/DNA_Balk.png'

const useDnaBarWidth = () => {
    const windowSize = useWindowSize()
    const [dnaBarWidth, setDnaBarWidth] = useState(96)

    useEffect(() => {
        setDnaBarWidth(windowSize.width < 768 ? 40 : 96)
    }, [windowSize])

    return dnaBarWidth
}

function DNABar() {
    const windowSize = useWindowSize()
    const dnaBarWidth = useDnaBarWidth()

    return (
        <div
            className={`absolute top-0 pointer-events-none right-0 z-10 ${
                windowSize.width > 640 ? '' : 'hidden'
            }`}>
            <img
                className="inline-block"
                title="Provincie Zuid-Holland Logo"
                style={{ width: dnaBarWidth + 'px' }}
                src={logoSVG}
                alt="Provincie Zuid-Holland Logo"
            />
        </div>
    )
}

export default DNABar
export { useDnaBarWidth }
