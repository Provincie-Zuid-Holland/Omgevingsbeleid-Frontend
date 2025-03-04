import { TabItem, Tabs, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { LeafletMap } from '@/components/Leaflet'
import SearchBar from '@/components/SearchBar'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'

const SearchSection = () => (
    <div className="col-span-6 mt-4 bg-pzh-gray-200 px-4 pb-8 pt-4 sm:px-6 lg:col-span-4 lg:mt-0">
        <Tabs>
            <TabItem title="Zoeken op tekst">
                <div className="mt-4">
                    <SearchBar label="Naar welk onderwerp ben je op zoek?" />
                </div>
            </TabItem>
            <TabItem title="Zoeken op de kaart">
                <>
                    <Text className="mt-4">
                        Wil je het beleid en de regelgeving van de provincie op
                        een specifieke locatie raadplegen? Zoek hieronder op een
                        locatie of markeer een punt of vorm op de kaart.
                    </Text>
                    <div className="mx-auto mt-4 w-full" id="leaflet-homepage">
                        <LeafletMap
                            controllers={{
                                showSearch: false,
                                showDraw: true,
                                showLayers: false,
                            }}
                            className="w-full rounded border border-pzh-gray-300"
                        />
                    </div>
                    <div className="mt-4">
                        <Link
                            to={MAP_SEARCH_PAGE}
                            className="text-pzh-green-500 underline hover:text-pzh-green-900">
                            Wilt u uitgebreider zoeken op de kaart?
                        </Link>
                    </div>
                </>
            </TabItem>
        </Tabs>
    </div>
)

export default SearchSection
