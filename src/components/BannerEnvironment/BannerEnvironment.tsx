import { Xmark } from '@pzh-ui/icons'
import { useCallback, useEffect } from 'react'

import { environment, Environment } from '@/api/instance'

/**
 *
 * @param {string} environment - type of environment
 * @returns {string} - Text for the banner indicating the environment
 */
const getEnvironmentText = (environment: Environment): string => {
    switch (environment) {
        case 'dev':
            return 'Ontwikkelomgeving'
        case 'test':
            return 'Testomgeving'
        case 'acc':
            return 'Acceptatieomgeving'
        case 'prod':
            return 'Live-omgeving'
        default:
            return 'No environment set'
    }
}

/**
 * Displays a banner that displays the current environment.
 *
 * @param {boolean} userIsInMuteerEnvironment - Used to determine if the user is in the muteer environment.
 * @param {boolean} hideBannerLocalStorage - Contains the hide banner state in the local storage.
 */

interface BannerEnvironmentProps {
    userIsInMuteerEnvironment: boolean
    hideBannerLocalStorage: () => boolean
    showBanner: boolean
    setShowBanner: (boolean: any) => void
}

const BannerEnvironment = ({
    userIsInMuteerEnvironment,
    hideBannerLocalStorage,
    showBanner,
    setShowBanner,
}: BannerEnvironmentProps) => {
    const removeBanner = useCallback(() => {
        setShowBanner(false)
    }, [setShowBanner])

    const addBanner = useCallback(() => {
        setShowBanner(true)
    }, [setShowBanner])

    useEffect(() => {
        if (userIsInMuteerEnvironment && !hideBannerLocalStorage()) {
            addBanner()
        } else {
            removeBanner()
        }
    }, [
        userIsInMuteerEnvironment,
        addBanner,
        removeBanner,
        hideBannerLocalStorage,
    ])

    const setHideBannerLocalStorage = () => {
        localStorage.setItem('__OB_hide_banner__', new Date().toString())
    }

    const getEnvironmentCSSClass = () => {
        switch (environment) {
            case 'dev':
                return 'banner-dev'
            case 'test':
                return 'banner-test'
            case 'acc':
                return 'banner-acc'
            case 'prod':
                return 'banner-prod'
            default:
                return 'banner-dev'
        }
    }

    if (!showBanner) return null

    return (
        <div
            className={`z-10 fixed bottom-0 left-0 rounded-tr ${getEnvironmentCSSClass()}`}>
            <div className="flex px-4 pt-3 pb-2">
                <div>
                    <span className="text-xs block">Huidige omgeving:</span>
                    <span className="text-sm block font-bold">
                        {getEnvironmentText(environment)}
                    </span>
                </div>
                <div className="ml-2">
                    <button
                        type="button"
                        className="flex p-1 -mt-1 -mr-2 transition duration-150 ease-in-out rounded-lg focus:outline-none hide-banner"
                        onClick={() => {
                            setShowBanner(!showBanner)
                            removeBanner()
                            setHideBannerLocalStorage()
                        }}
                        aria-label="sluiten">
                        <Xmark />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BannerEnvironment
export { getEnvironmentText }
