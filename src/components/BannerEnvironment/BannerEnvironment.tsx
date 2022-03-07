import { useCallback, useEffect, useState } from 'react'

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
}

const BannerEnvironment = ({
    userIsInMuteerEnvironment,
    hideBannerLocalStorage,
}: BannerEnvironmentProps) => {
    const [showBanner, setShowBanner] = useState(
        userIsInMuteerEnvironment && !hideBannerLocalStorage()
    )

    const removeBanner = useCallback(() => {
        const mainContainer = document.getElementById('main-container')
        if (!mainContainer) return
        mainContainer.style.removeProperty('margin-top')
        setShowBanner(false)
    }, [])

    const addBanner = useCallback(() => {
        addMarginTop()
        setShowBanner(true)
    }, [])

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

    const addMarginTop = () => {
        const mainContainer = document.getElementById('main-container')
        if (!mainContainer) return
        mainContainer.style.marginTop = '148px'
        mainContainer.style.paddingTop = '30px'
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
        <div className={`relative ${getEnvironmentCSSClass()}`}>
            <div className="max-w-screen-xl px-3 py-2 mx-auto sm:px-6 lg:px-8">
                <div className="pr-16 sm:text-center sm:px-16">
                    <p className="font-medium">
                        <span className="text-sm font-bold leading-4 tracking-wider uppercase rounded hide-banner">
                            {getEnvironmentText(environment)}
                        </span>
                    </p>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
                    <button
                        type="button"
                        className="flex p-1 transition duration-150 ease-in-out rounded-lg focus:outline-none hide-banner"
                        onClick={() => {
                            setShowBanner(!showBanner)
                            removeBanner()
                            setHideBannerLocalStorage()
                        }}
                        aria-label="sluiten">
                        <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BannerEnvironment
export { getEnvironmentText }
