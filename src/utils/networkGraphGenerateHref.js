/**
 * Function that returns the href slug to a detail page of a specific object
 * @param {object} props
 * @param {string} property - Type of the object
 * @param {string} UUID - UUID of the object
 * @returns {string} containing the url slug
 */
const networkGraphGenerateHref = ({ property, UUID }) => {
    const slugs = {
        beleidskeuzes: 'beleidskeuzes',
        ambities: 'ambities',
        beleidsregels: 'beleidsregels',
        beleidsprestaties: 'beleidsprestaties',
        belangen: 'belangen',
        maatregelen: 'maatregelen',
        themas: 'themas',
        beleidsdoelen: 'beleidsdoelen',
        verordening: 'verordeningen',
    }

    const path = `/detail/${slugs[property]}/${UUID}`
    return path
}

export default networkGraphGenerateHref
