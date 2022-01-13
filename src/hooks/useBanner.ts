import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useBanner = (graphIsOpen: boolean) => {
    const location = useLocation()
    const pathname = location.pathname

    const [locationEqualsMutateEnv, setLocationEqualsMutateEnv] =
        useState(false)

    useEffect(() => {
        const userIsInMuteer =
            pathname.includes('muteer') || pathname.includes('login')
        setLocationEqualsMutateEnv(userIsInMuteer)
    }, [pathname])

    useEffect(() => {
        if (graphIsOpen) {
            const header = document.getElementById('navigation-main')

            header?.classList.remove(
                'transition-all',
                'duration-200',
                'ease-in'
            )
            header?.classList.remove('hide-nav')
            window.setTimeout(
                () =>
                    header?.classList.add(
                        'transition-all',
                        'duration-200',
                        'ease-in'
                    ),
                100
            )
        }
    }, [graphIsOpen])

    return { locationEqualsMutateEnv }
}

export default useBanner