import { useMedia } from 'react-use'

const useBreakpoint = () => {
    const isMobile = useMedia('(max-width: 640px)')
    const isDesktop = useMedia('(min-width: 1024px)')

    return { isMobile, isDesktop }
}

export default useBreakpoint
