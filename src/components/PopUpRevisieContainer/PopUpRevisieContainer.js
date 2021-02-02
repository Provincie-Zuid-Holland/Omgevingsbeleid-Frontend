import React, { Component } from 'react'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Component that renders the PopUpRevisieContainer component.
 *
 * @component
 * @extends Component
 */
class PopUpRevisieContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()

        this.toggleOpen = this.toggleOpen.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    /**
     * Function to set (toggle) the state of open.
     *
     * @function
     */
    toggleOpen() {
        this.setState({
            open: !this.state.open,
        })
    }

    /**
     * Function that handles click events from the user and based on the values the state of open is set to false.
     *
     * @function
     *
     * @param {e} e - Parameter used to catch click event from user.
     */
    handleClick = e => {
        if (
            this.innerContainer.current &&
            !this.innerContainer.current.contains(e.target) &&
            this.state.open === true
        ) {
            this.setState({
                open: false,
            })
            return
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
            <span
                className="text-gray-600 text-sm mr-3 relative"
                ref={this.innerContainer}
            >
                <span
                    onClick={this.toggleOpen}
                    className="cursor-pointer select-none"
                >
                    <FontAwesomeIcon className="mr-2" icon={faClock} />
                    <span className="hover:underline">
                        {this.props.aantalRevisies}{' '}
                        {this.props.aantalRevisies === 1
                            ? 'revisie'
                            : 'revisies'}
                    </span>
                </span>
                {this.state.open ? (
                    <div className="main-tooltip-container absolute bg-white left-0 rounded mt-2 w-48 -ml-12 text-gray-700 z-20">
                        <div className="h-full relative">
                            <div className="absolute w-1 h-full border-l border-gray-300 z-0 top-0 ml-6" />
                            <ul className="py-2 px-4">{this.props.children}</ul>
                        </div>
                    </div>
                ) : null}
            </span>
        )
    }
}

export default PopUpRevisieContainer
