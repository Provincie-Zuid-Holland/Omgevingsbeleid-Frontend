import { matchPath } from 'react-router-dom'

import networkGraphGenerateHref, {
    networkSlugs,
} from './networkGraphGenerateHref'

const properties: (keyof typeof networkSlugs)[] = [
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

    const setup = (property: keyof typeof networkSlugs) => {
        const href = networkGraphGenerateHref({
            property,
            UUID,
        })
        expect(href).toBeTruthy()

        const match: { params: { uuid?: string; slug?: string } } | null =
            matchPath('/detail/:slug/:uuid', href || '')
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
        const { href } = setup('verordeningen')

        expect(href).toEqual('/detail/verordening?actief=0000-0000-0000-0000')
    })
})
