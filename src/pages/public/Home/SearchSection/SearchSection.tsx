import { Text } from '@pzh-ui/components'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { LeafletMap } from '@/components/Leaflet'
import SearchBar from '@/components/SearchBar'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'

function SearchSection() {
    const [currentView, setCurrentView] = useState('text')

    return (
        <div className="col-span-6 px-3 pt-3 pb-6 mt-4 sm:px-6 lg:mt-0 lg:col-span-4 bg-pzh-gray-300">
            <div className="w-full text-sm border-b border-gray-400 sm:text-base">
                <div
                    className="inline-block px-2 pl-0"
                    onClick={() => setCurrentView('text')}>
                    <SearchSectionLabel
                        text="Zoeken op tekst"
                        active={currentView === 'text'}
                    />
                </div>
                <div
                    className="inline-block px-2"
                    onClick={() => setCurrentView('map')}>
                    <SearchSectionLabel
                        text="Zoeken op de kaart"
                        active={currentView === 'map'}
                    />
                </div>
            </div>
            {currentView === 'text' ? (
                <div>
                    <Text type="body" className="mt-4">
                        Naar welk onderwerp ben je op zoek?
                    </Text>
                    <SearchBar className="mt-2" id="search-query-home" />
                </div>
            ) : currentView === 'map' ? (
                <div>
                    <Text type="body" className="mt-4">
                        Wil je het beleid en de regelgeving van de provincie op
                        een specifieke locatie raadplegen? Zoek hieronder op een
                        locatie of markeer een punt of vorm op de kaart.
                    </Text>
                    <div className="w-full mx-auto mt-4" id="leaflet-homepage">
                        <LeafletMap
                            controllers={{ showSearch: false, showDraw: true }}
                            className="w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mt-4">
                        <Link
                            to={MAP_SEARCH_PAGE}
                            className="underline text-pzh-green hover:text-pzh-green-dark">
                            Wilt u uitgebreider zoeken op de kaart?
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

interface SearchSectionLabelProps {
    active?: boolean
    text: string
}

const SearchSectionLabel = ({ active, text }: SearchSectionLabelProps) => {
    if (active) {
        return (
            <span className="inline-block py-1 font-bold border-b-4 border-pzh-green text-pzh-green">
                {text}
            </span>
        )
    }

    return (
        <span className="inline-block py-1 transition-colors duration-150 ease-in cursor-pointer hover:text-pzh-green">
            {text}
        </span>
    )
}

export default SearchSection
