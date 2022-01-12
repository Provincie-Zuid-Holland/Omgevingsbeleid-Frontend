import { matchPath } from 'react-router-dom'

import networkGraphGenerateHref from './networkGraphGenerateHref'

const properties = [
    'beleidskeuzes',
    'ambities',
    'beleidsregels',
    'beleidsprestaties',
    'belangen',
    'maatregelen',
    'themas',
    'beleidsdoelen',
]

describe('NetworkGraphGenerateHref', () => {
    const UUID = '0000-0000-0000-0000'

    const setup = (property, verordeningsStructure = null) => {
        const href = networkGraphGenerateHref({
            property,
            UUID,
            verordeningsStructure,
        })
        expect(href).toBeTruthy()

        const match = matchPath(href, {
            path: `/detail/:slug/:uuid`,
            exact: true,
        })
        const uuidFromURL = match?.params?.uuid
        const slugFromURL = match?.params?.slug

        return { uuidFromURL, slugFromURL, match, href }
    }

    properties.forEach(property => {
        it(`Returns a href for property ${property}`, () => {
            const { uuidFromURL, slugFromURL } = setup(property)
            expect(uuidFromURL).toEqual('0000-0000-0000-0000')
            expect(uuidFromURL).not.toEqual(undefined)
            expect(slugFromURL).toEqual(property)
            expect(slugFromURL).not.toEqual(undefined)
        })
    })

    it(`Returns a undefined for property 'verordeningen' if no 'verordeningsStructure' is provided`, () => {
        const { uuidFromURL, slugFromURL } = setup('verordeningen')
        expect(uuidFromURL).toEqual(undefined)
        expect(slugFromURL).toEqual(undefined)
    })

    it(`Returns a correct URL for property 'verordeningen' if a 'verordeningsStructure' is provided`, () => {
        const verordeningsStructure = {
            ID: 1,
            Structuur: {
                Children: [
                    {
                        UUID: UUID,
                    },
                ],
            },
        }

        const { href } = setup('verordeningen', verordeningsStructure)

        expect(href).toEqual('/detail/verordening?actief=0000-0000-0000-0000')
    })
})
