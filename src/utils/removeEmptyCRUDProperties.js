const removeEmptyCRUDProperties = (obj) => {
    const skipProperties = [
        "Gebied",
        "Begin_Geldigheid",
        "Eind_Geldigheid",
        "Eigenaar_1",
        "Eigenaar_2",
        "Portefeuillehouder_1",
        "Portefeuillehouder_2",
        "Opdrachtgever",
    ]
    Object.keys(obj).forEach((property) => {
        if (skipProperties.includes(property)) return
        if (obj[property] === null || obj[property] === undefined) {
            delete obj[property]
        }
    })
    return obj
}

export { removeEmptyCRUDProperties }
