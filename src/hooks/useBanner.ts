import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useBanner = () => {
    const location = useLocation()
    const pathname = location.pathname

    const [locationEqualsMutateEnv, setLocationEqualsMutateEnv] =
        useState(false)

    useEffect(() => {
        const userIsInMuteer =
            pathname.includes('muteer') || pathname.includes('login')
        setLocationEqualsMutateEnv(userIsInMuteer)
    }, [pathname])

    return { locationEqualsMutateEnv }
}

export default useBanner
