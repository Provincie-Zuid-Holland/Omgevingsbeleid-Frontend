import { useMediaQuery } from '@react-hookz/web'

const useBreakpoint = () => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const isDesktop = useMediaQuery('(min-width: 1024px)')

    return { isMobile, isDesktop }
}

export default useBreakpoint
