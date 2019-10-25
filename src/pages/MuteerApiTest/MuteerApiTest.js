import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Import Components
import SidebarMain from './../../components/SidebarMain'
import ContainerAnimateContent from './../../components/ContainerAnimateContent'
import ContainerMain from './../../components/ContainerMain'

function LabelGenerator(props) {
    let statusCSS = ''
    let statusName = ''
    if (props.status === 'not working') {
        statusCSS = 'bg-red-200 text-red-700'
        statusName = 'API Not Working'
    } else if (props.status === 'wip') {
        statusCSS = 'bg-orange-200 text-yellow-700'
        statusName = 'API Work in Progress'
    } else if (props.status === 'finished') {
        statusCSS = 'bg-green-200 text-green-700'
        statusName = 'API Fully Functional'
    }
    return (
        <span
            className={`${statusCSS} font-bold py-2 px-4 text-sm rounded-full`}
        >
            {statusName}
        </span>
    )
}

const APITestItemList = {
    Ambities: { url: 'ambities', status: 'finished' },
    BeleidsRegels: { url: 'beleidsregels', status: 'finished' },
    Doelen: { url: 'doelen', status: 'finished' },
    'Provinciale Belangen': { url: 'provinciale-belangen', status: 'finished' },
    'Beleids Relaties': { url: 'beleidsrelaties', status: 'finished' },
    Maatregelen: { url: 'maatregelen', status: 'wip' },
    Themas: { url: 'themas', status: 'finished' },
    Opgaven: { url: 'opgaven', status: 'finished' },
    Verordening: { url: 'verordeningen', status: 'wip' },
}

function APITestItem(props) {
    const listItems = Object.keys(APITestItemList).map((key, index) => (
        <li key={index} id="API-list" className="w-1/2 py-3">
            <ContainerAnimateContent>
                <Link
                    to={
                        APITestItemList[key].status !== 'not working'
                            ? '/api-test/' + APITestItemList[key].url
                            : ''
                    }
                    className={
                        APITestItemList[key].status === 'not working'
                            ? 'cursor-not-allowed'
                            : null
                    }
                >
                    <div className="h-full px-4 py-6 shadow-md rounded overflow-hidden bg-white">
                        <h5 className="text-gray-600 text-sm font-light py-1">
                            API Test
                        </h5>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {key}
                        </h2>
                        <LabelGenerator status={APITestItemList[key].status} />
                    </div>
                </Link>
            </ContainerAnimateContent>
        </li>
    ))

    return (
        <ul className="flex w-full flex-wrap" id="API-list">
            {listItems}
        </ul>
    )
}

class MuteerApiTest extends Component {
    render() {
        return (
            <ContainerMain>
                {/* Sidebar */}
                <SidebarMain />

                {/* Dashboard */}
                <div className="w-3/4 rounded inline-block flex-grow pl-8">
                    <h2 className="heading-serif text-gray-800 mb-4">
                        API Test Overzicht
                    </h2>
                    <APITestItem />
                </div>
            </ContainerMain>
        )
    }
}

export default MuteerApiTest
