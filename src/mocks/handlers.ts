/* istanbul ignore file */
import { HttpResponse, http } from 'msw'

import { getOmgevingsbeleidAPIMSW } from '@/api/fetchers.msw'

import { geoLookup } from './data/geoLookup'
import { geoSuggest } from './data/geoSuggest'

export const handlers = [
    ...getOmgevingsbeleidAPIMSW(),
    http.get(
        'https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest',
        async () => {
            return new HttpResponse(JSON.stringify(geoSuggest), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
    ),

    http.get(
        'https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup',
        async () => {
            return new HttpResponse(JSON.stringify(geoLookup), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
    ),
]
