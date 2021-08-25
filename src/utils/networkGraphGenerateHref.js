import generateVerordeningsPosition from "./generateVerordeningsPosition"

/**
 * Function that returns the href slug to a detail page of a specific object
 * @param {object} props
 * @param {string} property - Type of the object
 * @param {string} UUID - UUID of the object
 * @returns {string} containing the url slug
 */
const networkGraphGenerateHref = ({
    property,
    UUID,
    verordeningsStructure,
}) => {
    if (!property) return null

    const slugs = {
        beleidskeuzes: "beleidskeuzes",
        ambities: "ambities",
        beleidsregels: "beleidsregels",
        beleidsprestaties: "beleidsprestaties",
        belangen: "belangen",
        maatregelen: "maatregelen",
        themas: "themas",
        beleidsdoelen: "beleidsdoelen",
        verordeningen: "verordeningen",
    }

    if (property === "verordeningen") {
        const positionInVerordening = generateVerordeningsPosition(
            UUID,
            verordeningsStructure
        )

        const href = `/detail/verordeningen/${
            verordeningsStructure?.ID
        }/${UUID}?hoofdstuk=${
            positionInVerordening[0] !== undefined
                ? positionInVerordening[0]
                : "null"
        }&nest_1=${
            positionInVerordening[1] !== undefined
                ? positionInVerordening[1]
                : "null"
        }&nest_2=${
            positionInVerordening[2] !== undefined
                ? positionInVerordening[2]
                : "null"
        }&nest_3=${
            positionInVerordening[3] !== undefined
                ? positionInVerordening[3]
                : "null"
        }`

        return href
    } else {
        return `/detail/${slugs[property]}/${UUID}`
    }
}

export default networkGraphGenerateHref
