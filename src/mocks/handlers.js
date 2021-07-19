import { rest } from "msw"
import { baseURL } from "./../API/axios"
import allDimensies from "./../constants/dimensies"

import { graph } from "./data/graph"
import { werkingsgebieden } from "./data/werkingsgebieden"
import { users } from "./data/users"
import { verordeningstructuur } from "./data/verordeningstructuur"
import { ambities } from "./data/ambities"
import { beleidskeuzes } from "./data/beleidskeuzes"
import { belangen } from "./data/belangen"
import { beleidsmodules } from "./data/beleidsmodules"
import { beleidsdoelen } from "./data/beleidsdoelen"
import { beleidsprestaties } from "./data/beleidsprestaties"
import { beleidsrelaties } from "./data/beleidsrelaties"
import { beleidsregels } from "./data/beleidsregels"
import { maatregelen } from "./data/maatregelen"
import { themas } from "./data/themas"

const dimensions = [
    "AMBITIES",
    "BELANGEN",
    "BELEIDSREGELS",
    "MAATREGELEN",
    "BELEIDSDOELEN",
    "THEMAS",
    "BELEIDSKEUZES",
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
                    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjIwMTc4MDQsIm5iZiI6MTYyMjAxNzgwNCwianRpIjoiODlkYjUxOWYtM2U5My00OWJiLTk5Y2ItYjcwZmQyZDg3YTRmIiwiZXhwIjoxNjIyMDMyMjA0LCJpZGVudGl0eSI6eyJVVUlEIjoiMzU5QTkyNTQtNTk4RS00QkZFLUJDRUMtQUE1MjFFOTU4ODFBIiwiR2VicnVpa2Vyc25hYW0iOiJBaWRlbiBCdWlzIiwiRW1haWwiOiJoZWxsb0BhaWRlbmJ1aXMuY29tIiwiUm9sIjoiQmVoZWVyZGVyIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.2oOLjv_s7fgxQb7SlhUDrMuEP7krQaEl6bx2vzPfayc",
                "deployment type": "Development",
                expires: "2021-05-26T12:30:04Z",
                identifier: {
                    Email: "hello@aidenbuis.com",
                    Gebruikersnaam: "Aiden Buis",
                    Rol: "Beheerder",
                    UUID: "359A9254-598E-4BFE-BCEC-AA521E95881A",
                },
            })
        )
    }),

    rest.get(`${baseURL}/beleidsregels`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsregels))
    }),

    rest.get(
        `${baseURL}/beleidsregels/${beleidsregels[0].ID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidsregels))
        }
    ),

    rest.get(`${baseURL}/maatregelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(maatregelen))
    }),

    rest.get(`${baseURL}/valid/maatregelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(maatregelen))
    }),

    rest.get(`${baseURL}/themas`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(themas))
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

    rest.get(`${baseURL}/ambities`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ambities))
    }),

    rest.get(`${baseURL}/beleidskeuzes`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidskeuzes))
    }),

    rest.get(
        `${baseURL}/version/beleidskeuzes/${beleidskeuzes[0].UUID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidskeuzes[0]))
        }
    ),

    rest.get(`${baseURL}/valid/beleidskeuzes`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidskeuzes))
    }),

    rest.get(`${baseURL}/beleidsmodules`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsmodules))
    }),

    rest.patch(
        `${baseURL}/beleidsmodules/${beleidsmodules[1].ID}`,
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(beleidsmodules[1]))
        }
    ),

    rest.get(`${baseURL}/belangen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(belangen))
    }),

    rest.get(`${baseURL}/beleidsrelaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsrelaties))
    }),

    rest.post(`${baseURL}/beleidsrelaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsrelaties[0]))
    }),

    rest.get(`${baseURL}/beleidsdoelen`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsdoelen))
    }),

    rest.get(`${baseURL}/beleidsprestaties`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(beleidsprestaties))
    }),

    rest.get(`${baseURL}/verordeningstructuur`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(verordeningstructuur))
    }),

    ...getDimensions,
    ...patchDimensions,
]
