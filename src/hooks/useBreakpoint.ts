import { useMedia } from 'react-use'

const useBreakpoint = () => {
    const isMobile = useMedia('(max-width: 640px)')

    return { isMobile }
}

export default useBreakpoint
