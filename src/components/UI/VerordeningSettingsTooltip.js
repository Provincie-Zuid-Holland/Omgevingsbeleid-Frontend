import React, { Component } from 'react'
import KnopIconSliderSettings from './KnopIconSliderSettings'

class VerordeningSettingsTooltip extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false
        }

        this.innerContainer = React.createRef()

        this.toggleOpen = this.toggleOpen.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    toggleOpen() {
        console.log("Triggered!")
        this.setState({
            open: !this.state.open
        })
    }

    handleClick = (e) => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.state.open === true
        ) {
            this.setState({
                open: false
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

            <span className="text-gray-600 text-sm relative" ref={this.innerContainer}>
                
                <KnopIconSliderSettings toggleOpen={this.toggleOpen}/>
                
                {
                    this.state.open ?
                    <div id="main-tooltip-container" className="absolute bg-white right-0 rounded mt-2 bg-white w-64 -ml-12 pb-2 text-gray-700 z-20">
                        <h4 className="px-4 py-2 w-full border-b border-gray-300 font-bold">Onderdelen</h4>
                        <ul className="py-2 text-sm text-gray-700 px-4">
                            <li key="1" className="mt-1 text-gray-700 text-sm">
                                <label className="cursor-pointer select-none">
                                    <input className="mr-2 leading-tight" type="checkbox"/>
                                    <span>Toon alleen mijn onderdelen</span>
                                </label>
                            </li>
                            <li key="2" className="mt-1 text-gray-700 text-sm">
                                <label className="cursor-pointer select-none">
                                    <input onClick={this.props.toggleMainSideBar}  className="mr-2 leading-tight" type="checkbox" defaultChecked={this.props.hideMainSideBar}/>
                                    <span>Verberg menu</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    : null
                }
            </span>
        )
    }
}

export default VerordeningSettingsTooltip