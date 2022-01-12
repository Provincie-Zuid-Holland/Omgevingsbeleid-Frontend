import { useEffect, useState } from 'react'

/**
 * Responsive breakpoints are as follows:
 * sm	640px	@media min-width: 640px
 * md	768px	@media min-width: 768px
 * lg	1024px	@media min-width: 1024px
 * xl	1280px	@media min-width: 1280px
 * 2xl	1536px	@media min-width: 1536px
 * See the tailwind documentation:
 * https://tailwindcss.com/docs/responsive-design
 * @returns {object} - Returns the window size in the format {width: x, height: y}
 */
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        // Add event listener
        window.addEventListener('resize', handleResize)
        // Call handler right away so state gets updated with initial window size
        handleResize()
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, []) // Empty array ensures that effect is only run on mount
    return windowSize
}

export { useWindowSize }
