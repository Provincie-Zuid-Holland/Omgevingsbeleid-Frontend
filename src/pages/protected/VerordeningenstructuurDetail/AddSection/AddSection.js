/* istanbul ignore file */
import { Heading, Tag } from '@pzh-ui/components'
import { AlignLeft, Paragraph, Plus } from '@pzh-ui/icons'
import { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'

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
            onClick={onClick}>
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
            reference={reference}>
            <ul className="flex">
                {type === 'Hoofdstuk' ? (
                    <li>
                        <Link
                            className="inline-block w-24 p-4 font-bold text-center rounded cursor-pointer hover:bg-gray-100"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Hoofdstuk?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}>
                            <Heading
                                size={18}
                                className="relative inline-block mb-2"
                            />
                            <span className="block">Hoofdstuk</span>
                        </Link>
                    </li>
                ) : null}
                {type === 'Bovenste' || type === 'Afdeling' ? (
                    <li>
                        <Link
                            className="inline-block w-24 p-4 font-bold text-center rounded cursor-pointer hover:bg-gray-100"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Afdeling?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}>
                            <Tag
                                size={18}
                                className="relative inline-block mb-2"
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
                            className="inline-block w-24 p-4 font-bold text-center rounded cursor-pointer hover:bg-gray-100"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Paragraaf?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}>
                            <Paragraph
                                size={18}
                                className="relative inline-block mb-2"
                            />
                            <span className="block">Paragraaf</span>
                        </Link>
                    </li>
                ) : null}
                {type !== 'Bovenste' && type !== 'Hoofdstuk' ? (
                    <li>
                        <Link
                            className="inline-block w-24 p-4 font-bold text-center rounded cursor-pointer hover:bg-gray-100"
                            to={`/muteer/verordeningen/${lineageID}/nieuw/Artikel?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}>
                            <AlignLeft
                                size={18}
                                className="relative inline-block mb-2"
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

        this.container = createRef()
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
                onClick={this.togglePopup}>
                <div className="absolute w-full h-0 border-b border-gray-300 opacity-0 cursor-pointer popup-divider transition-regular" />
                <span className="z-10 p-2 bg-white rounded-full cursor-pointer popup-plus-icon transition-regular">
                    <span className="flex items-center justify-center w-5 h-5 font-bold bg-white border-2 rounded-full border-pzh-green text-pzh-green">
                        <Plus className="relative text-pzh-green" />
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

export default AddSection
