import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useLastLocation } from "react-router-last-location"
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const BackButton = ({ className = "" }) => {
    const history = useHistory()
    const location = useLocation()
    const lastLocation = useLastLocation()

    const goBack = () => {
        if (
            lastLocation?.pathname &&
            lastLocation.pathname !== location.pathname
        ) {
            history.goBack()
        } else {
            history.push("/")
        }
    }

    return (
        <div
            onClick={() => goBack()}
            className={`${className} text-pzh-blue cursor-pointer opacity-75 hover:opacity-100 transition-opacity ease-in duration-100 mb-4 inline-block`}
            id="button-back-to-previous-page"
        >
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            <span>Terug</span>
        </div>
    )
}

export default BackButton
