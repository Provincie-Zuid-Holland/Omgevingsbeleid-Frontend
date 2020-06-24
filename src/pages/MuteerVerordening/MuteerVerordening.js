import React, { Component } from 'react'
import { faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons'
import {
    faPlusSquare,
    faMinusSquare,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import PopUpVerordeningSettings from './../../components/PopUpVerordeningSettings'

function HoofdstukSubSubItem(props) {
    return (
        <li className="relative py-2 pl-10 text-sm text-gray-700 border-t border-gray-300">
            Afdeling 3.1 Titel van sub onderdeel
            <FontAwesomeIcon
                className="absolute right-0 mt-1 mr-2 text-gray-600 font-xl"
                icon={faChevronRight}
            />
        </li>
    )
}

class HoofdstukSubItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            openState: false,
        }

        this.toggleOpenState = this.toggleOpenState.bind(this)
    }

    toggleOpenState() {
        this.setState({
            openState: !this.state.openState,
        })
    }

    render() {
        return (
            <li className="relative py-2 pr-2 text-sm text-gray-700 border-b border-gray-300">
                {this.state.openState === true ? (
                    <FontAwesomeIcon
                        className="absolute left-0 mt-1 ml-4 cursor-pointer"
                        icon={faMinusSquare}
                        onClick={this.toggleOpenState}
                    />
                ) : (
                    <FontAwesomeIcon
                        className="absolute left-0 mt-1 ml-4 cursor-pointer"
                        icon={faPlusSquare}
                        onClick={this.toggleOpenState}
                    />
                )}

                <span
                    className={`${
                        this.state.openState ? 'font-bold' : null
                    } pl-10 cursor-pointer select-none`}
                    onClick={this.toggleOpenState}
                >
                    Afdeling 3.1 Titel van sub onderdeel
                </span>
                <FontAwesomeIcon
                    className="absolute right-0 mt-1 mr-4 text-gray-600 font-xl"
                    icon={faChevronRight}
                />
                {this.state.openState === true ? (
                    <ul className="mt-2 font-normal">{this.props.children}</ul>
                ) : null}
            </li>
        )
    }
}

function HoofdstukSubContainer(props) {
    return (
        <div className="w-2/3 px-4 py-2">
            <h3 className="block text-gray-800 heading-lg">Hoofdstuk 3</h3>
            <span className="block font-bold text-gray-800 heading-lg">
                Activiteiten in de fysieke leefomgeving
            </span>
            <ul className="mt-2 border-t border-gray-300">{props.children}</ul>
        </div>
    )
}

function HoofdstukMainItem(props) {
    return (
        <li
            onClick={() => props.setActiveItem(props.item)}
            className="relative py-3 text-sm border-r border-gray-200 cursor-pointer verordening-list-item"
        >
            <span className="inline-block pl-2 whitespace-pre-wrap">
                Hoofstuk X Lorum Ipsum
            </span>
            <FontAwesomeIcon
                className="absolute right-0 mt-1 mr-4 text-gray-600 font-xl"
                icon={faChevronRight}
            />
        </li>
    )
}

// function HoofdstukMainContainer() {
//     return (
//         <ul className="w-1/3 text-sm text-gray-700 verordening-list-container">
//             <HoofdstukMainItem />
//             <HoofdstukMainItem />
//             <HoofdstukMainItem />
//             <HoofdstukMainItem />
//             <HoofdstukMainItem />
//             <HoofdstukMainItem />
//         </ul>
//     )
// }

class MuteerVerordening extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objecten: [],
            hideMainSideBar: false,
            geopendHoofdstuk: {},
            dataLoaded: false,
            activeItem: null,
        }
        this.toggleMainSideBar = this.toggleMainSideBar.bind(this)
        this.setActiveItem = this.setActiveItem.bind(this)
    }

    setActiveItem(item) {
        this.setState({
            activeItem: item,
        })
    }

    toggleMainSideBar() {
        this.setState({
            showMainSideBar: !this.state.showMainSideBar,
        })
    }

    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Verordening</title>
                </Helmet>

                {this.state.showMainSideBar ? null : <SidebarMain />}

                {/* Container */}

                <div
                    className={`${
                        this.state.showMainSideBar ? 'w-full' : 'w-1/3'
                    } rounded inline-block flex-grow pl-8`}
                >
                    <h2 className="mb-4 font-serif text-gray-700">
                        Verordening
                    </h2>

                    <div className="px-5 py-5 bg-white rounded shadow">
                        <div className="flex justify-between">
                            <h2 className="mb-2 mb-4 font-bold heading-xl">
                                Verordening
                            </h2>
                            <div className="flex">
                                <PopUpVerordeningSettings
                                    toggleMainSideBar={this.toggleMainSideBar}
                                    hideMainSideBar={this.state.hideMainSideBar}
                                />

                                <div className="relative">
                                    <input
                                        className="block w-48 py-2 pl-4 pr-12 text-sm leading-tight text-gray-700 border border-gray-300 rounded appearance-none focus:outline-none hover:border-gray-400 focus:border-gray-400"
                                        name="titel"
                                        type="text"
                                        placeholder="Zoeken"
                                    />
                                    <FontAwesomeIcon
                                        className="absolute top-0 right-0 mt-3 mr-4 text-sm text-gray-600"
                                        icon={faSearch}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <ul className="w-1/3 text-sm text-gray-700 verordening-list-container">
                                {this.state.dataLoaded
                                    ? this.state.objecten.map((item) => {
                                          return (
                                              <HoofdstukMainItem
                                                  setActiveItem={
                                                      this.setActiveItem
                                                  }
                                                  item={item}
                                              />
                                          )
                                      })
                                    : null}
                                {/* <HoofdstukMainContainer /> */}
                            </ul>

                            <HoofdstukSubContainer>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                </HoofdstukSubItem>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                </HoofdstukSubItem>
                                <HoofdstukSubItem>
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                    <HoofdstukSubSubItem />
                                </HoofdstukSubItem>
                            </HoofdstukSubContainer>
                        </div>
                    </div>
                </div>
            </ContainerMain>
        )
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint

        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then((res) => {
                const objecten = res.data
                this.setState({ objecten: objecten, dataLoaded: true })
            })
            .catch((error) => {
                this.setState({ dataLoaded: true })
                console.log(error)
            })
    }
}

export default MuteerVerordening
