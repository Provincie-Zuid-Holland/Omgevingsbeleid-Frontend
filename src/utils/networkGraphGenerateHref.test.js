import networkGraphGenerateHref from './networkGraphGenerateHref'
import { matchPath } from 'react-router-dom'

const properties = [
    'beleidskeuzes',
    'ambities',
    'beleidsregels',
    'beleidsprestaties',
    'belangen',
    'maatregelen',
    'themas',
    'beleidsdoelen',
    'verordening',
]

const UUID = '0000-0000-0000-0000'

describe('NetworkGraphGenerateHref', () => {
    properties.forEach((property) => {
        it(`Returns a href for property ${property}`, () => {
            const href = networkGraphGenerateHref({ property, UUID })
            expect(href).toBeTruthy()

            const match = matchPath(href, {
                path: `/detail/:slug/:uuid`,
                exact: true,
            })

            const uuidFromURL = match?.params?.uuid
            const slugFromURL = match?.params?.slug

            expect(uuidFromURL).toEqual('0000-0000-0000-0000')
            expect(uuidFromURL).not.toEqual('undefined')
            expect(slugFromURL).not.toEqual('undefined')
        })
    })
})
