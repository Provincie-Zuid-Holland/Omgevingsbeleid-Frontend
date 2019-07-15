import React, { Component } from 'react';

// Import Componenents
import MainSidebar from './MainSidebar';
import VerordeningSettingsTooltip from './UI/VerordeningSettingsTooltip'

// Import Icons
import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// // Import Axios instance to connect with the API
// import axiosAPI from './../API/axios'


function HoofdstukSubSubItem(props){

    return(
        <li className="pl-10 text-gray-700 py-2 border-t border-gray-300 text-sm relative">
            Afdeling 3.1 Titel van sub onderdeel
            <FontAwesomeIcon className="font-xl absolute text-gray-600 mt-1 right-0 mr-2" icon={faChevronRight}/>
        </li>
    )

}

class HoofdstukSubItem extends Component{

    constructor(props){
        super(props)
        
        this.state = {
            openState: false
        }
        
        this.toggleOpenState = this.toggleOpenState.bind(this)
    }

    toggleOpenState() {
        this.setState({
            openState: !this.state.openState
        })
        console.log(this.state.openState)
    }

    render(){
    
        return(
            <li className="text-gray-700 py-2 pr-2 border-b border-gray-300 text-sm relative">
                {
                    this.state.openState === true ?
                    <FontAwesomeIcon 
                        className="absolute cursor-pointer left-0 ml-4 mt-1" 
                        icon={faMinusSquare} 
                        onClick={this.toggleOpenState}
                    /> :
                    <FontAwesomeIcon 
                        className="absolute cursor-pointer left-0 ml-4 mt-1" 
                        icon={faPlusSquare} 
                        onClick={this.toggleOpenState}
                    />
                }

                <span className={`${this.state.openState ? "font-bold" : null} pl-10 cursor-pointer select-none`} onClick={this.toggleOpenState}>
                    Afdeling 3.1 Titel van sub onderdeel
                </span>
                <FontAwesomeIcon className="font-xl absolute text-gray-600 mt-1 mr-4 right-0" icon={faChevronRight}/>
                {
                    this.state.openState === true ?
                    <ul className="mt-2 font-normal">
                        {this.props.children}
                    </ul>
                    : null
                }
            </li>
        )
    }
}


function HoofdstukSubContainer(props) {
    return(
        <div className="w-2/3 px-4 py-2">
            <h3 className="text-gray-700 text-lg">Hoofdstuk 3</h3>
            <span className="text-gray-700 text-lg font-bold">Activiteiten in de fysieke leefomgeving</span>
            <ul className="border-t border-gray-300 mt-2">
                {props.children}
            </ul>
        </div>
    )
}

function HoofdstukMainItem(props) {

    return(
        <li className="py-3 border-r border-gray-200 relative verordening-list-item text-sm cursor-pointer">
            <span className="pl-2 whitespace-pre-wrap inline-block">
                Hoofstuk X Lorum Ipsum
            </span>
            <FontAwesomeIcon className="font-xl absolute text-gray-600 mt-1 mr-4 right-0" icon={faChevronRight}/>
        </li>
    )

}

function HoofdstukMainContainer() {
    
    return(
        <ul className="text-sm text-gray-700 verordening-list-container w-1/3">
            <HoofdstukMainItem />
            <HoofdstukMainItem />
            <HoofdstukMainItem />
            <HoofdstukMainItem />
            <HoofdstukMainItem />
            <HoofdstukMainItem />
        </ul>
    )

}

class Verordening extends Component {

	constructor(props) {
		super(props)
		this.state = {
            objecten: [],
            hideMainSideBar: false,
            geopendHoofdstuk: {}
        }
        this.toggleMainSideBar = this.toggleMainSideBar.bind(this)
    }
    
    toggleMainSideBar() {
        this.setState({
            showMainSideBar: !this.state.showMainSideBar
        }, () => {console.log(this.state.showMainSideBar)})
        console.log("Hide sidebar")
    }

	render() {

		// // False if data is loading, true if there is a response
        // let dataReceived = this.state.objecten[0]

		return (

			<div className="container mx-auto flex px-6 pb-8">
				
                {
                    this.state.showMainSideBar ?
                    null :
                    <MainSidebar/>
                }

                {/* Container */}
                
				<div className={`${this.state.showMainSideBar ? "w-1/3" : "w-full"} rounded inline-block flex-grow pl-8`}>
					
					<h2 className="mb-4 font-serif text-gray-700">
                        Verordening
					</h2>

					<div className="px-5 py-5 bg-white rounded shadow">
                        
                        <div className="flex justify-between">
                            <h2 className="mb-4 text-gray-700 text-xl font-bold mb-2 inline-block">Verordening</h2>
                            <div className="flex">

                                <VerordeningSettingsTooltip toggleMainSideBar={this.toggleMainSideBar}
                                hideMainSideBar={this.state.hideMainSideBar}
                                />
                                
                                <div className="relative">
                                    <input 
                                        className="appearance-none w-48 block text-gray-700 border border-gray-300 rounded py-2 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-400 focus:border-gray-400 text-sm"
                                        name="titel"
                                        type="text"
                                        placeholder="Zoeken"
                                    />
                                    <FontAwesomeIcon className="absolute right-0 top-0 mr-4 mt-3 text-gray-600 text-sm" icon={faSearch} />
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            
                            <HoofdstukMainContainer/>
                            <HoofdstukSubContainer>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                </HoofdstukSubItem>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                </HoofdstukSubItem>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                    <HoofdstukSubSubItem/>
                                </HoofdstukSubItem>
                            </HoofdstukSubContainer>
                            
                        </div>
                    </div>

				</div>

			</div>
			
		)

	}

	componentDidMount() {

	}

}   

export default Verordening