import React from "react"

import { environment } from "./../../API/axios"
/**
 * Function to render the BannerEnvironment component.
 *
 * @param {boolean} userIsInMuteerEnvironment - Parameter used within the function to show the banner within the rendered component.
 * @param {boolean} hideBannerLocalStorage - Parameter used within the function to hide the banner within the rendered component.
 */
function BannerEnvironment({
    userIsInMuteerEnvironment,
    hideBannerLocalStorage,
}) {
    const getEnvironmentText = () => {
        switch (environment) {
            case "dev":
                return "Ontwikkelomgeving"
            case "test":
                return "Testomgeving"
            case "acc":
                return "Acceptatieomgeving"
            case "prod":
                return "Live-omgeving"
            default:
                return "No environment set"
        }
    }

    const [showBanner, setShowBanner] = React.useState(
        userIsInMuteerEnvironment && !hideBannerLocalStorage()
    )

    React.useEffect(() => {
        // Check
        if (!hideBannerLocalStorage()) {
            addMarginTop()
        }
    }, [hideBannerLocalStorage])

    const removeBanner = React.useCallback(() => {
        const mainContainer = document.getElementById("main-container")
        if (!mainContainer) return
        mainContainer.style.removeProperty("margin-top")
        setShowBanner(false)
    }, [])

    const addBanner = React.useCallback(() => {
        addMarginTop()
        setShowBanner(true)
    }, [])

    React.useEffect(() => {
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
        localStorage.setItem("__OB_hide_banner__", new Date())
    }

    const addMarginTop = () => {
        const mainContainer = document.getElementById("main-container")
        if (!mainContainer) return
        mainContainer.style.marginTop = "118px"
    }

    const getEnvironmentCSSClass = () => {
        switch (environment) {
            case "dev":
                return "banner-dev"
            case "test":
                return "banner-test"
            case "acc":
                return "banner-acc"
            case "prod":
                return "banner-prod"
            default:
                return "banner-dev"
        }
    }

    if (!showBanner) return null

    return (
        <div className={`relative ${getEnvironmentCSSClass()}`}>
            <div className="max-w-screen-xl px-3 py-2 mx-auto sm:px-6 lg:px-8">
                <div className="pr-16 sm:text-center sm:px-16">
                    <p className="font-medium">
                        <span className="text-sm font-bold leading-4 tracking-wider uppercase rounded hide-banner">
                            {getEnvironmentText()}
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
                    >
                        <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
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
