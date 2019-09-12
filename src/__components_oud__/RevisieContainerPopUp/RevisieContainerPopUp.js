import React, { Component } from 'react'

import { faClock, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class RevisieContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()

        this.toggleOpen = this.toggleOpen.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    toggleOpen() {
        this.setState({
            open: !this.state.open,
        })
    }

    handleClick = e => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.state.open === true
        ) {
            this.setState({
                open: false,
            })
            return
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    render() {
        return (
            <span
                className="text-gray-600 text-sm mr-3 relative"
                ref={this.innerContainer}
            >
                <span
                    onClick={this.toggleOpen}
                    className="cursor-pointer select-none"
                >
                    <FontAwesomeIcon className="mr-2" icon={faClock} />
                    <span className="hover:underline">4 revisies</span>
                </span>
                {this.state.open ? (
                    <div
                        id="main-tooltip-container"
                        className="absolute bg-white left-0 rounded mt-2 w-48 -ml-12 text-gray-700"
                    >
                        <div className="h-full relative">
                            <div className="absolute w-1 h-full border-l border-gray-300 z-0 top-0 ml-6" />
                            <ul className="py-2 px-4">{this.props.children}</ul>
                        </div>
                        <div className="border-t border-gray-300 py-2 text-sm text-gray-700 px-4 cursor-pointer hover:underline">
                            Vergelijken
                            <FontAwesomeIcon
                                className="right-0 absolute text-gray-700 mr-4 mt-1"
                                icon={faAngleRight}
                            />
                        </div>
                    </div>
                ) : null}
            </span>
        )
    }
}

export default RevisieContainer
