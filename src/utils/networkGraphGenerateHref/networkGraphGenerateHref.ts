/**
 * Function that returns the href slug to a detail page of a specific object
 * @param {object} props
 * @param {string} property - Type of the object
 * @param {string} UUID - UUID of the object
 * @returns {string} containing the url slug
 */

export const networkSlugs = {
    beleidskeuzes: 'beleidskeuzes',
    ambities: 'ambities',
    beleidsregels: 'beleidsregels',
    beleidsprestaties: 'beleidsprestaties',
    belangen: 'belangen',
    maatregelen: 'maatregelen',
    themas: 'themas',
    beleidsdoelen: 'beleidsdoelen',
    verordeningen: 'verordeningen',
}

const networkGraphGenerateHref = ({
    property,
    UUID,
}: {
    property: keyof typeof networkSlugs
    UUID: string
}) => {
    if (!property) return null

    if (property === 'verordeningen') {
        return `/verordening?actief=${UUID}`
    } else {
        return `/${networkSlugs[property]}/${UUID}`
    }
}

export default networkGraphGenerateHref
