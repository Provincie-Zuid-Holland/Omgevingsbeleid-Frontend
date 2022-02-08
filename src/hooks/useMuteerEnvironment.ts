import { useLocation } from 'react-router-dom'

const useMuteerEnvironment = () => {
    const location = useLocation()
    const pathname = location.pathname

    return pathname.includes('/muteer/')
}

export default useMuteerEnvironment
