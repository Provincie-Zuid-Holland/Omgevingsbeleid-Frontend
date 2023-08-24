import { FieldSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { Map, Marker } from 'leaflet'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'

import {
    Location,
    getLookupData,
    getSuggestData,
} from '@/api/axiosLocatieserver'
import { toastNotification } from '@/utils/toastNotification'

import { mapPanTo } from '../utils'

type Option = {
    label: string
    value: Location
}

/**
 * Class that renders the LeafletSearchInput component that shows a input field in which a user can search werkgebieden on a map.
 */

interface LeafletSearchInputProps {
    mapInstance: Map
    searchCallback?: (marker: Marker) => void
    drawCallback?: (callback: any) => void
    placeholder?: string
}

const LeafletSearchInput = ({
    mapInstance,
    searchCallback,
    drawCallback,
    placeholder = 'Zoeken op de kaart',
}: LeafletSearchInputProps) => {
    const navigate = useNavigate()

    /**
     * Function to import the API axiosLocatieServer and then get the lookupData through an API get request. Then the lookupData is used further in the function.
     */
    const locatieServerLookupQuery = (id: string, naam: string) => {
        getLookupData(id)
            .then(data => {
                const latLng = data.centroide_ll
                    .split('(')[1]
                    .split(')')[0]
                    .split(' ')
                const lng = parseFloat(latLng[0]).toFixed(20)
                const lat = parseFloat(latLng[1]).toFixed(20)

                const marker = mapPanTo({
                    map: mapInstance,
                    navigate,
                    lng: parseFloat(lng),
                    lat: parseFloat(lat),
                    type: data.type,
                    layerType: 'marker',
                    callback: drawCallback,
                    locationName: naam,
                })

                searchCallback?.(marker)
            })
            .catch(() => {
                toastNotification('error')
            })
    }

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        getSuggestData(query)
            .then(data => {
                callback(
                    data.response.docs?.map(object => ({
                        label: object.weergavenaam,
                        value: object,
                    })) || []
                )
            })
            .catch(() => callback([]))
    }

    const handleSuggestions = debounce(loadSuggestions, 500)

    /**
     * Function to use the value parameter in the locatieServerSuggestQuery function.
     */
    function handleChange(e: Location) {
        locatieServerLookupQuery(e.id, e.weergavenaam)
    }

    return (
        <FieldSelect
            name="leaflet-search"
            loadOptions={handleSuggestions}
            placeholder={placeholder}
            onChange={val => handleChange((val as Option).value)}
            isAsync
            cacheOptions
            noOptionsMessage={({ inputValue }) =>
                !inputValue
                    ? 'Start met typen om te zoeken'
                    : 'Geen adressen gevonden'
            }
            loadingMessage={() => 'Zoeken...'}
            components={{
                DropdownIndicator: () => (
                    <div className="mr-4">
                        <MagnifyingGlass
                            size={18}
                            className="text-pzh-blue-dark"
                        />
                    </div>
                ),
            }}
        />
    )
}

export default LeafletSearchInput
