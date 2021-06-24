import { rest } from 'msw'
import { baseURL } from './../API/axios'
import allDimensies from './../constants/dimensies'

const dimensions = [
    'AMBITIES',
    'BELANGEN',
    'BELEIDSREGELS',
    'MAATREGELEN',
    'BELEIDSDOELEN',
    'THEMAS',
    'BELEIDSKEUZES',
]

const graph = {
    links: [
        {
            source: '0000-0001',
            target: '0000-0002',
            type: 'Koppeling',
        },
    ],
    nodes: [
        {
            Titel: 'Test node 1',
            Type: 'beleidsdoelen',
            UUID: '0000-0001',
        },
        {
            Titel: 'Test node 2',
            Type: 'beleidsdoelen',
            UUID: '0000-0002',
        },
    ],
}

const werkingsgebieden = [
    {
        ID: 2,
        UUID: '46ADF8F1-91F6-465D-9708-267B74EC68F2',
        Begin_Geldigheid: '2018-10-30T00:00:00Z',
        Eind_Geldigheid: '2999-12-31T23:59:59Z',
        Created_By: null,
        Created_Date: '2018-10-30T00:00:00Z',
        Modified_By: null,
        Modified_Date: '2018-10-30T00:00:00Z',
        Werkingsgebied: 'Bedrijventerrein',
        symbol: null,
    },
    {
        ID: 3,
        UUID: '86689750-475C-4067-9170-4FD906B83BED',
        Begin_Geldigheid: '2018-10-30T00:00:00Z',
        Eind_Geldigheid: '2999-12-31T23:59:59Z',
        Created_By: null,
        Created_Date: '2018-10-30T00:00:00Z',
        Modified_By: null,
        Modified_Date: '2018-10-30T00:00:00Z',
        Werkingsgebied: 'Bestaand stads- en dorpsgebied 2018',
        symbol: null,
    },
]

const users = [
    {
        UUID: '79A74958-DB05-464C-BD19-011D85672E4D',
        Gebruikersnaam: 'Annette ter Kuile',
        Rol: 'Ambtelijk opdrachtgever',
        Status: null,
    },
    {
        UUID: '0D5855A4-8288-445A-8CDB-016B8BDBBDB9',
        Gebruikersnaam: 'Roderick Groen',
        Rol: 'Behandelend Ambtenaar',
        Status: null,
    },
    {
        Gebruikersnaam: 'Jeannette Baljeu',
        Rol: 'Portefeuillehouder',
        Status: null,
        UUID: '6152EF5E-D748-4304-9DB3-045FB031CDE1',
    },
    {
        Gebruikersnaam: 'Dirk van Duivendijk',
        Rol: 'Technisch beheerder',
        Status: null,
        UUID: '100770E4-2321-4A31-A6FD-047D69832E59',
    },
]

const getDimensions = dimensions.map((dimension) => {
    const apiSlug = allDimensies[dimension].API_ENDPOINT
    const url = `${baseURL}/${apiSlug}/1`
    const testResponse = {}

    Object.keys(allDimensies[dimension].CRUD_PROPERTIES).forEach((key) => {
        testResponse[key] =
            allDimensies[dimension].CRUD_PROPERTIES[key].testValue
    })

    return rest.get(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([testResponse]))
    })
})

const patchDimensions = dimensions.map((dimension) => {
    const apiSlug = allDimensies[dimension].API_ENDPOINT
    const url = `${baseURL}/${apiSlug}/1`
    const testResponse = {}

    Object.keys(allDimensies[dimension].CRUD_PROPERTIES).forEach((key) => {
        testResponse[key] =
            allDimensies[dimension].CRUD_PROPERTIES[key].testValue
    })

    return rest.patch(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([testResponse]))
    })
})

export const handlers = [
    rest.post(`${baseURL}/login`, (req, res, ctx) => {
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

    rest.get(`${baseURL}/werkingsgebieden`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(werkingsgebieden))
    }),

    rest.get(`${baseURL}/graph`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(graph))
    }),

    rest.get(`${baseURL}/gebruikers`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(users))
    }),

    ...getDimensions,
    ...patchDimensions,
]
