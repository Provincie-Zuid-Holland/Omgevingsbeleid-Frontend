import React, { Component } from 'react'
import { useSpring, animated } from 'react-spring'
import { Link, withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {
    faTag,
    faParagraph,
    faAlignLeft,
    faHeading,
} from '@fortawesome/pro-regular-svg-icons'

function AnimatedContainer({ classes, children, reference, onClick }) {
    return (
        <animated.div
            style={useSpring({
                config: { tension: 550 },
                transform: 'scale(1)',
                from: { transform: 'scale(0.9)' },
            })}
            className={classes}
            ref={reference}
            onClick={onClick}
        >
            {children}
        </animated.div>
    )
}

function VoegSectieToePopup({
    reference,
    type,
    hoofdstukIndex,
    nest_1,
    nest_2,
    nest_3,
    lineageID,
}) {
    return (
        <AnimatedContainer
            classes="absolute z-30 bg-white shadow-lg p-4 rounded verordening-sectie-popup"
            reference={reference}
        >
            <ul className="flex">
                {type === 'Hoofdstuk' ? (
                    <li>
                        <Link
                            className="p-4 rounded hover:bg-gray-100 text-center font-semibold w-24 cursor-pointer inline-block"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Hoofdstuk?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}
                        >
                            <FontAwesomeIcon
                                className="relative text-lg inline-block mb-2"
                                icon={faHeading}
                            />
                            <span className="block">Hoofdstuk</span>
                        </Link>
                    </li>
                ) : null}
                {type === 'Bovenste' || type === 'Afdeling' ? (
                    <li>
                        <Link
                            className="p-4 rounded hover:bg-gray-100 text-center font-semibold w-24 cursor-pointer inline-block"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Afdeling?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}
                        >
                            <FontAwesomeIcon
                                className="relative text-lg inline-block mb-2"
                                icon={faTag}
                            />
                            <span className="block">Afdeling</span>
                        </Link>
                    </li>
                ) : null}
                {type === 'Bovenste' ||
                type === 'Afdeling' ||
                type === 'Paragraaf' ? (
                    <li>
                        <Link
                            className="p-4 rounded hover:bg-gray-100 text-center font-semibold w-24 cursor-pointer inline-block"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Paragraaf?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}
                        >
                            <FontAwesomeIcon
                                className="relative text-lg inline-block mb-2"
                                icon={faParagraph}
                            />
                            <span className="block">Paragraaf</span>
                        </Link>
                    </li>
                ) : null}
                {type !== 'Bovenste' && type !== 'Hoofdstuk' ? (
                    <li>
                        <Link
                            className="p-4 rounded hover:bg-gray-100 text-center font-semibold w-24 cursor-pointer inline-block"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Artikel?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}
                        >
                            <FontAwesomeIcon
                                className="relative text-lg inline-block mb-2"
                                icon={faAlignLeft}
                            />
                            <span className="block">Artikel</span>
                        </Link>
                    </li>
                ) : null}
            </ul>
        </AnimatedContainer>
    )
}

class AddSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPopup: false,
        }
        this.togglePopup = this.togglePopup.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.escFunction = this.escFunction.bind(this)

        this.container = React.createRef()
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup,
        })
    }

    handleClick(e) {
        if (!this.state.showPopup) {
            return
        } else if (this.container.current.contains(e.target)) {
            return
        }

        this.togglePopup()
    }

    escFunction(event) {
        if (this.state.showPopup && event.keyCode === 27) {
            this.togglePopup()
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false)
        document.addEventListener('keydown', this.escFunction, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
        document.removeEventListener('keydown', this.escFunction, false)
    }

    render() {
        return (
            <AnimatedContainer
                classes={`w-full text-gray-700 text-sm py-2 inline-block flex justify-center items-center relative cursor-pointer verordening-sectie-popup-container ${
                    this.state.showPopup ? 'z-30' : ''
                }`}
                onClick={this.togglePopup}
            >
                <div className="absolute w-full h-0 border-b border-gray-300 opacity-0 popup-divider transition-regular cursor-pointer" />
                <span className="popup-plus-icon transition-regular z-10 rounded-full bg-white p-2 cursor-pointer">
                    <span className="flex bg-white justify-center items-center border-2 border-green-600 text-green-600 w-5 h-5 rounded-full font-bold">
                        <FontAwesomeIcon
                            className="relative text-green-600 text-xs"
                            icon={faPlus}
                        />
                    </span>
                </span>
                {this.state.showPopup ? (
                    <VoegSectieToePopup
                        type={this.props.type}
                        reference={this.container}
                        hoofdstukIndex={this.props.hoofdstukIndex}
                        nest_1={this.props.nest_1}
                        nest_2={this.props.nest_2}
                        nest_3={this.props.nest_3}
                        lineageID={this.props.match.params.lineageID}
                    />
                ) : null}
            </AnimatedContainer>
        )
    }
}

export default withRouter(AddSection)
