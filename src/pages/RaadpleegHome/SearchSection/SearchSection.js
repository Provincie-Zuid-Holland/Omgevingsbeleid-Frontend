import React from "react"

import Text from "./../../../components/Text"
import LeafletViewer from "./../../../components/LeafletViewer"
import SearchBar from "./../../../components/SearchBar"

function SearchSection() {
    const [currentView, setCurrentView] = React.useState("text")

    return (
        <div className="col-span-6 px-6 pt-3 pb-6 mt-4 lg:mt-0 lg:col-span-4 bg-pzh-cool-gray-light bg-opacity-30">
            <div className="w-full border-b border-gray-400">
                <div
                    className="inline-block px-2 pl-0"
                    onClick={() => setCurrentView("text")}
                >
                    <SearchSectionLabel
                        text="Zoeken op tekst"
                        active={currentView === "text"}
                    />
                </div>
                <div
                    className="inline-block px-2"
                    onClick={() => setCurrentView("map")}
                >
                    <SearchSectionLabel
                        text="Zoeken op de kaart"
                        active={currentView === "map"}
                    />
                </div>
            </div>
            {currentView === "text" ? (
                <div>
                    <Text type="body" className="mt-4">
                        Naar welk onderwerp bent u opzoek?
                    </Text>
                    <SearchBar className="mt-2" />
                </div>
            ) : currentView === "map" ? (
                <div>
                    <Text type="body" className="mt-4">
                        Wilt u het beleid en de regelgeving van de provincie op
                        een specifieke locatie raadplegen? Zoek hieronder op een
                        locatie of markeer een punt of vorm op de kaart.
                    </Text>
                    <div className="w-full mx-auto mt-4" id="leaflet-homepage">
                        <LeafletViewer className="w-full border border-gray-300 rounded" />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

const SearchSectionLabel = ({ active, text }) => {
    if (active) {
        return (
            <span className="inline-block py-1 font-bold border-b-4 border-pzh-green text-pzh-green">
                {text}
            </span>
        )
    } else {
        return (
            <span className="inline-block py-1 transition-colors duration-150 ease-in cursor-pointer hover:text-pzh-green">
                {text}
            </span>
        )
    }
}

export default SearchSection
