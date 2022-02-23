import { useLocation } from 'react-router-dom'

const useAdvancedSearchPage = () => {
    const location = useLocation()
    const pathname = location.pathname

    return pathname.includes('/zoeken-op-kaart')
}

export default useAdvancedSearchPage
