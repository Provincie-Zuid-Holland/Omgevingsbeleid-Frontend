import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class PopUpDetailDropdown extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (e) => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.props.openState === true
        ) {
            this.props.toggleDropdown()
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    render() {
        const status = this.props.dataObject.Status
        return (
            <div
                className="absolute top-0 right-0 z-10 w-48 mt-2 mt-12 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
                ref={this.innerContainer}
            >
                <div className="relative h-full">
                    <ul className="text-sm text-gray-800">
                        {status !== 'Vigerend' && status !== 'Gepubliceerd' ? (
                            <li
                                className="px-4 py-2 text-sm cursor-pointer"
                                onClick={() => {
                                    this.props.toggleDropdown()
                                    this.props.toggleStatusPopup()
                                }}
                            >
                                Status aanpassen
                            </li>
                        ) : null}
                        <li>
                            <a
                                href={this.props.raadpleegLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="navbar-popup-href-raadpleeg-omgeving"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Raadpleegomgeving
                            </a>
                        </li>
                        <li>
                            <a
                                href={`/muteer/beleidsrelaties/${this.props.dataObject.UUID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="navbar-popup-href-beleidsrelaties"
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Bekijk beleidsrelaties
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default PopUpDetailDropdown
