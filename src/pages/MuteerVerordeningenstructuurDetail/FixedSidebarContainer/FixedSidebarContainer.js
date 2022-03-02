/* istanbul ignore file */

import { useLayoutEffect, useState } from 'react'

const FixedSidebarContainer = ({
    children,
    show,
    alignWithContainer,
    elementID,
}) => {
    const [styles, setStyles] = useState(0)
    const [windowSize, setWindowSize] = useState(null)

    const verticalPadding = 20

    useLayoutEffect(() => {
        const initializeStyles = val => setStyles(val)
        const regulationContainer = document.getElementById(
            'regulation-container'
        )
        const navigation = document.getElementById('top-navigation')
        const containerWidth = regulationContainer.offsetWidth
        const oneThirdContainerWidth = containerWidth * 0.333

        const offsetTop = alignWithContainer
            ? regulationContainer.offsetTop - 20
            : navigation?.offsetTop + navigation?.offsetHeight

        const offsetLeft =
            containerWidth * 0.666 + regulationContainer.offsetLeft

        initializeStyles({
            width: oneThirdContainerWidth,
            yPosition: offsetTop + verticalPadding,
            xPosition: offsetLeft,
        })

        const handleResize = () => {
            setWindowSize(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowSize, alignWithContainer])

    // Left gets +10 pixels to align it with the menu
    return (
        <div
            id={elementID ? elementID : null}
            className={`fixed z-10 inline-block pr-3 pl-10 ${
                show ? '' : 'pointer-events-none'
            }`}
            style={{
                width: styles.width + 'px',
                top: styles.yPosition + 'px',
                left: styles.xPosition + 12 + 'px',
                height: `calc(100vh - ${styles.yPosition}px)`,
                overflowY: 'auto',
            }}>
            {children}
        </div>
    )
}

export default FixedSidebarContainer
