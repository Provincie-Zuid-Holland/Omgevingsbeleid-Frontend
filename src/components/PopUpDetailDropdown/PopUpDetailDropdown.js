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

    handleClick = e => {
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
        return (
            <div
                className="main-tooltip-container main-tooltip-container-muteer-detail tooltip-right absolute bg-white shadow rounded mt-2 w-48  text-gray-700 right-0 top-0 mr-2 mt-12"
                ref={this.innerContainer}
            >
                <div className="h-full relative">
                    <ul className="text-sm text-gray-800">
                        <li
                            className="py-2 px-4 text-sm cursor-pointer"
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
                                className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                            >
                                Raadpleegomgeving
                            </Link>
                        </li>
                        <li>
                            <Link
                                id="navbar-popup-href-uitloggen"
                                className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                                to={`/login`}
                            >
                                Uitloggen
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default PopUpDetailDropdown
