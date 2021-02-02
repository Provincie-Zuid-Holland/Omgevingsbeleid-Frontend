import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Class that renders the PopUpDetailDropdown component.
 *
 * @class
 * @extends Component
 */
class PopUpDetailDropdown extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()
        this.handleClick = this.handleClick.bind(this)
    }

    /**
     * Function that handles click events from the user.
     *
     * @function
     *
     * @param {e} e - Parameter used to catch click event from user.
     */
    handleClick = (e) => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.props.openState === true
        ) {
            this.props.toggleDropdown()
        }
    }

    /**
     * Function to add the click event listener.
     *
     * @function
     */
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    /**
     * Funcion to remove the click event listener.
     *
     * @function
     */
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    render() {
        return (
            <div
                className="absolute top-0 right-0 w-48 mt-2 mt-12 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
                ref={this.innerContainer}
            >
                <div className="relative h-full">
                    <ul className="text-sm text-gray-800">
                        <li
                            className="px-4 py-2 text-sm cursor-pointer"
                            onClick={() => {
                                this.props.toggleDropdown()
                                this.props.toggleStatusPopup()
                            }}
                        >
                            Status aanpassen
                        </li>
                        <li>
                            <Link
                                id="navbar-popup-href-raadpleeg-omgeving"
                                to={`/`}
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Raadpleegomgeving
                            </Link>
                        </li>
                        <li>
                            <Link
                                id="navbar-popup-href-raadpleeg-omgeving"
                                to={`/muteer/beleidsrelaties/${this.props.dataObject.UUID}`}
                                className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                            >
                                Bekijk beleidsrelaties
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default PopUpDetailDropdown
