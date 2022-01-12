/**
 * Function that returns the href slug to a detail page of a specific object
 * @param {object} props
 * @param {string} property - Type of the object
 * @param {string} UUID - UUID of the object
 * @returns {string} containing the url slug
 */
const networkGraphGenerateHref = ({ property, UUID }) => {
    if (!property) return null

    const slugs = {
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

    if (property === 'verordeningen') {
        return `/detail/verordening?actief=${UUID}`
    } else {
        return `/detail/${slugs[property]}/${UUID}`
    }
}

export default networkGraphGenerateHref
