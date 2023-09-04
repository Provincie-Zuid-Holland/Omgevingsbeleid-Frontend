import { Link } from 'react-router-dom'

import { TabItem, Tabs, Text } from '@pzh-ui/components'

import { LeafletMap } from '@/components/Leaflet'
import SearchBar from '@/components/SearchBar'
import { MAP_SEARCH_PAGE } from '@/constants/leaflet'

const SearchSection = () => (
    <div className="col-span-6 mt-4 bg-pzh-gray-200 px-3 pb-6 pt-3 sm:px-6 lg:col-span-4 lg:mt-0">
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
                    <div className="mx-auto mt-4 w-full" id="leaflet-homepage">
                        <LeafletMap
                            controllers={{
                                showSearch: false,
                                showDraw: true,
                            }}
                            className="w-full rounded border border-gray-300"
                        />
                    </div>
                    <div className="mt-4">
                        <Link
                            to={MAP_SEARCH_PAGE}
                            className="text-pzh-green underline hover:text-pzh-green-dark">
                            Wilt u uitgebreider zoeken op de kaart?
                        </Link>
                    </div>
                </>
            </TabItem>
        </Tabs>
    </div>
)

export default SearchSection
