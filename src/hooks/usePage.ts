import { useLocation } from 'react-router-dom'

const usePage = (path: string) => {
    const location = useLocation()
    const pathname = location.pathname

    return pathname.includes(path)
}

export default usePage
