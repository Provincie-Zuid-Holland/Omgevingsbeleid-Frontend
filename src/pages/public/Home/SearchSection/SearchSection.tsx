import { TabItem, Tabs, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { LeafletMap } from '@/components/Leaflet'
import SearchBar from '@/components/SearchBar'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'

const SearchSection = () => (
    <div className="col-span-6 px-3 pt-3 pb-6 mt-4 sm:px-6 lg:mt-0 lg:col-span-4 bg-pzh-gray-300">
        <Tabs>
            <TabItem title="Zoeken op tekst">
                <div className="mt-4">
                    <SearchBar label="Naar welk onderwerp ben je op zoek?" />
                </div>
            </TabItem>
            <TabItem title="Zoeken op de kaart">
                <>
                    <Text type="body" className="mt-4">
                        Wil je het beleid en de regelgeving van de provincie op
                        een specifieke locatie raadplegen? Zoek hieronder op een
                        locatie of markeer een punt of vorm op de kaart.
                    </Text>
                    <div className="w-full mx-auto mt-4" id="leaflet-homepage">
                        <LeafletMap
                            controllers={{
                                showSearch: false,
                                showDraw: true,
                            }}
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
                </>
            </TabItem>
        </Tabs>
    </div>
)

export default SearchSection
