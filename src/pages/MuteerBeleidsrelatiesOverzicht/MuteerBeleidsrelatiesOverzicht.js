import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import axios from './../../API/axios'

import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'

class MuteerBeleidsrelatiesOverzicht extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // get beleidsbeslissingen van de gebruiker
        axios
            .get(
                `/beleidsbeslissingen?Created_By=${
                    JSON.parse(localStorage.getItem('identifier')).UUID
                }`
            )
            .then(res => {
                this.setState(
                    {
                        beleidsrelaties: res.data,
                    },
                    () => console.log(this.state)
                )
            })
    }

    render() {
        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - Beleidsrelaties</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Maatregel Container */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif text-gray-800 mb-4">
                        Beleidsrelaties
                    </h2>
                    <div className="bg-white rounded p-4">
                        <div className="flex border-b border-gray-200 text-sm font-semibold text-gray-800 py-2">
                            <div className="w-6/12 pl-10">
                                Beleidsbeslissingen
                            </div>
                            <div className="w-2/12">Status</div>
                            <div className="w-2/12">Bevestigde</div>
                            <div className="w-2/12">Onbevestigde</div>
                            <div className="w-2/12">Verzoeken</div>
                        </div>
                        <ul>
                            <li className="flex border-b border-gray-200 text-sm text-gray-800 py-2">
                                <div className="w-6/12 pl-10">
                                    Grondwaterkwaliteit en -kwantiteit
                                </div>
                                <div className="w-2/12">Vigerend</div>
                                <div className="w-2/12">14</div>
                                <div className="w-2/12">2</div>
                                <div className="w-2/12">1</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </ContainerMain>
        )
    }
}

export default MuteerBeleidsrelatiesOverzicht
