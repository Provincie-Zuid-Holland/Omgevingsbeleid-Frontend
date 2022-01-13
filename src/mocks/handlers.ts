import { rest } from 'msw'

import { baseURL } from '../api/instance'
import allDimensies from '../constants/dimensies'
import { ambities } from './data/ambities'
import { artikel } from './data/artikel'
import { belangen } from './data/belangen'
import { beleidsdoelen } from './data/beleidsdoelen'
import { beleidskeuzes } from './data/beleidskeuzes'
import { beleidsmodules } from './data/beleidsmodules'
import { beleidsprestaties } from './data/beleidsprestaties'
import { beleidsregels } from './data/beleidsregels'
import { beleidsrelaties } from './data/beleidsrelaties'
import { geoLookup } from './data/geoLookup'
import { geoSuggest } from './data/geoSuggest'
import { geoWerkingsgebied } from './data/geoWerkingsgebied'
import { graph } from './data/graph'
import { maatregelen } from './data/maatregelen'
import { search } from './data/search'
import { themas } from './data/themas'
import { users } from './data/users'
import { verordeningstructuur } from './data/verordeningstructuur'
import { werkingsgebieden } from './data/werkingsgebieden'

type Dimensions =
    | 'AMBITIES'
    | 'BELANGEN'
    | 'BELEIDSREGELS'
    | 'MAATREGELEN'
    | 'BELEIDSDOELEN'
    | 'THEMAS'
    | 'BELEIDSKEUZES'

const dimensions: Dimensions[] = [
    'AMBITIES',
    'BELANGEN',
    'BELEIDSREGELS',
    'MAATREGELEN',
    'BELEIDSDOELEN',
    'THEMAS',
    'BELEIDSKEUZES',
]

const currentBaseURL = baseURL

const getDimensions = dimensions.map(dimension => {
    const apiSlug = allDimensies[dimension].API_ENDPOINT
    const url = `${currentBaseURL}/${apiSlug}/1`
    const testResponse: { [key: string]: string } = {}

    Object.keys(allDimensies[dimension].CRUD_PROPERTIES).forEach(key => {
        testResponse[key] = (allDimensies[dimension].CRUD_PROPERTIES as any)[
            key
        ].testValue
    })

    return rest.get(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([testResponse]))
    })
})

const patchDimensions = dimensions.map(dimension => {
    const apiSlug = allDimensies[dimension].API_ENDPOINT
    const url = `${currentBaseURL}/${apiSlug}/1`
    const testResponse: any = {}

    Object.keys(allDimensies[dimension].CRUD_PROPERTIES).forEach(key => {
        testResponse[key] = (allDimensies[dimension].CRUD_PROPERTIES as any)[
            key
        ].testValue
    })

    return rest.patch(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([testResponse]))
    })
})

export const handlers = [
    rest.post(`${currentBaseURL}/login`, (req, res, ctx) => {
        return res(
            ctx.json({
                access_token:
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjIwMTc4MDQsIm5iZiI6MTYyMjAxNzgwNCwianRpIjoiODlkYjUxOWYtM2U5My00OWJiLTk5Y2ItYjcwZmQyZDg3YTRmIiwiZXhwIjoxNjIyMDMyMjA0LCJpZGVudGl0eSI6eyJVVUlEIjoiMzU5QTkyNTQtNTk4RS00QkZFLUJDRUMtQUE1MjFFOTU4ODFBIiwiR2VicnVpa2Vyc25hYW0iOiJBaWRlbiBCdWlzIiwiRW1haWwiOiJoZWxsb0BhaWRlbmJ1aXMuY29tIiwiUm9sIjoiQmVoZWVyZGVyIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.2oOLjv_s7fgxQb7SlhUDrMuEP7krQaEl6bx2vzPfayc',
                'deployment type': 'Development',
                expires: '2021-05-26T12:30:04Z',
                identifier: {
                    Email: 'hello@aidenbuis.com',
                    Gebruikersnaam: 'Aiden Buis',
                    Rol: 'Beheerder',
                    UUID: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                },
            })
        )
    }),

    rest.get(`${currentBaseURL}/beleidsregels`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsregels))
    }),

    rest.get(`${currentBaseURL}/valid/beleidsregels`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsregels))
    }),

    rest.get(
        `${currentBaseURL}/beleidsregels/${beleidsregels[0].ID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidsregels))
        }
    ),

    rest.get(`${currentBaseURL}/maatregelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(maatregelen))
    }),

    rest.get(`${currentBaseURL}/valid/maatregelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(maatregelen))
    }),

    rest.get(`${currentBaseURL}/themas`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(themas))
    }),

    rest.get(`${currentBaseURL}/valid/themas`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(themas))
    }),

    rest.get(`${currentBaseURL}/werkingsgebieden`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(werkingsgebieden))
    }),

    rest.get(`${currentBaseURL}/valid/werkingsgebieden`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(werkingsgebieden))
    }),

    rest.get(`${currentBaseURL}/graph`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(graph))
    }),

    rest.get(`${currentBaseURL}/gebruikers`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(users))
    }),

    rest.get(`${currentBaseURL}/ambities`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ambities))
    }),

    rest.get(`${currentBaseURL}/valid/ambities`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ambities))
    }),

    rest.get(
        `https://geo-omgevingsbeleid-test.azurewebsites.net/OMGEVINGSBELEID/ows`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(geoWerkingsgebied))
        }
    ),

    rest.get(`${currentBaseURL}/beleidskeuzes`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidskeuzes))
    }),

    rest.get(`${currentBaseURL}/valid/beleidskeuzes`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidskeuzes))
    }),

    rest.get(
        `${currentBaseURL}/beleidskeuzes/${beleidskeuzes[0].ID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json([beleidskeuzes[0]]))
        }
    ),

    rest.get(
        `${currentBaseURL}/version/beleidskeuzes/${beleidskeuzes[0].UUID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidskeuzes[0]))
        }
    ),

    rest.get(`${currentBaseURL}/beleidsmodules`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsmodules))
    }),

    rest.get(`${currentBaseURL}/valid/beleidsmodules`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsmodules))
    }),

    rest.patch(
        `${currentBaseURL}/beleidsmodules/${beleidsmodules[1].ID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidsmodules[1]))
        }
    ),

    rest.get(`${currentBaseURL}/belangen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(belangen))
    }),

    rest.get(`${currentBaseURL}/valid/belangen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(belangen))
    }),

    rest.get(`${currentBaseURL}/beleidsrelaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsrelaties))
    }),

    rest.get(`${currentBaseURL}/valid/beleidsrelaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsrelaties))
    }),

    rest.post(`${currentBaseURL}/beleidsrelaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsrelaties[0]))
    }),

    rest.get(`${currentBaseURL}/beleidsdoelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsdoelen))
    }),

    rest.get(`${currentBaseURL}/valid/beleidsdoelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsdoelen))
    }),

    rest.get(`${currentBaseURL}/beleidsprestaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsprestaties))
    }),

    rest.get(`${currentBaseURL}/valid/beleidsprestaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsprestaties))
    }),

    rest.get(`${currentBaseURL}/verordeningstructuur`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(verordeningstructuur))
    }),

    rest.get(
        `${currentBaseURL}/valid/verordeningstructuur`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(verordeningstructuur))
        }
    ),

    rest.get(`${currentBaseURL}/verordeningstructuur/:id`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(verordeningstructuur))
    }),

    rest.get(
        `${currentBaseURL}/version/verordeningen/:uuid`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(artikel))
        }
    ),

    rest.get(`${currentBaseURL}/search`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(search))
    }),

    rest.get(
        `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(geoSuggest))
        }
    ),

    rest.get(
        `https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(geoLookup))
        }
    ),

    ...getDimensions,
    ...patchDimensions,
]
