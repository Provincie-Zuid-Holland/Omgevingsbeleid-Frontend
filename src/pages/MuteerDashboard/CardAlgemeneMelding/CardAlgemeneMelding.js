import React, { Component } from 'react'
import {
    faUnlink,
    faUserMinus,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CardAlgemeneMelding extends Component {
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
            <div className="p-4 mb-4 bg-white rounded shadow">
                <div className="flex items-center justify-start">
                    <div className="flex items-center justify-center inline-block w-12 h-12 text-white rounded-full bg-pzh-blue">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    <h3 className="ml-4 text-lg font-bold text-gray-800">
                        {this.props.titel}
                    </h3>

                    <span className="absolute right-0 mr-16 text-sm text-gray-600">
                        2 uur geleden
                    </span>
                </div>
                <div className="pb-4 pl-16">
                    {this.props.children}
                    <span className="px-4 py-2 mr-4 font-bold rounded cursor-not-allowed button-main">
                        {this.props.buttonText}
                    </span>
                    <span className="text-sm text-gray-700 underline cursor-not-allowed hover:text-gray-900">
                        Melding verbergen
                    </span>
                </div>
            </div>
        )
    }
}

export default CardAlgemeneMelding
