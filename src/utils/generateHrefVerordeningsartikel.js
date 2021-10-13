import generateVerordeningsPosition from "./generateVerordeningsPosition"

const generateHrefVerordeningsartikel = (uuid, verordeningsStructure) => {
    const positionInVerordening = generateVerordeningsPosition(
        uuid,
        verordeningsStructure
    )

    if (positionInVerordening.length === 0) return null

    const path = `/detail/verordeningen/${
        verordeningsStructure.ID
    }/${uuid}?hoofdstuk=${
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

    return path
}

export { generateHrefVerordeningsartikel }
