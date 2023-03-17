/* istanbul ignore file */
import { rest } from 'msw'

import { getOmgevingsbeleidAPIMSW } from '@/api/fetchers.msw'

import { geoLookup } from './data/geoLookup'
import { geoSuggest } from './data/geoSuggest'

export const handlers = [
    ...getOmgevingsbeleidAPIMSW(),
    rest.get(
        `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest`,
        (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(geoSuggest))
        }
    ),

    rest.get(
        `https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup`,
        (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(geoLookup))
        }
    ),
]
