import React, { Component } from 'react'

// Import Icons
import {
    faUnlink,
    faUserMinus,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class AandachtsPuntenAlgemeneMelding extends Component {
    render() {
        let icon
        if (this.props.icon === 'faUserMinus') {
            icon = faUserMinus
        } else if (this.props.icon === 'faUnlink') {
            icon = faUnlink
        } else if (this.props.icon === 'faExclamationTriangle') {
            icon = faExclamationTriangle
        }

        return (
            <div className="bg-white rounded shadow p-4 mb-4">
                <div className="flex items-center justify-start">
                    <div className="rounded-full mbg-color w-12 h-12 inline-block text-white flex justify-center items-center">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    <h3 className="heading-lg font-bold ml-4">
                        {this.props.titel}
                    </h3>

                    <span className="absolute right-0 text-gray-600 font-thin mr-16 text-sm">
                        2 uur geleden
                    </span>
                </div>
                <div className="pl-16 pb-4">
                    {this.props.children}
                    <span className="button button-main cursor-not-allowed mr-4">
                        {this.props.buttonText}
                    </span>
                    <span className="text-gray-700 text-sm underline cursor-not-allowed hover:text-gray-900">
                        Melding verbergen
                    </span>
                </div>
            </div>
        )
    }
}

export default AandachtsPuntenAlgemeneMelding
