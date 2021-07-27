import * as MAATREGELEN from "./maatregelen"
import * as BELEIDSKEUZES from "./beleidskeuzes"
import beleidskeuzeStatusAanpassen from "./beleidskeuzeStatusAanpassen"

/**
 * Extracts all the valid possible statuses from the nextStatusObject
 * @param {object} nextStatusObject - Object containing the possible next statuses
 * @returns {array} - array of valid statuses
 */
const getValidStatuses = (nextStatusObject) => {
    const validStatuses = []

    Object.keys(nextStatusObject).forEach((key) => {
        nextStatusObject[key].forEach((status) =>
            validStatuses.includes(status) ? null : validStatuses.push(status)
        )
    })

    expect(validStatuses.length).toBeGreaterThan(0)

    return validStatuses
}

/**
 * Checks if the values in the required fields of the crud properties are valid
 * @param {Object} obj - Contains the constant of the object
 */
const checkForInvalidRequiredValues = (obj) => {
    const validStatuses = getValidStatuses(beleidskeuzeStatusAanpassen)

    expect(obj).toBeTruthy()
    const properties = Object.keys(obj.CRUD_PROPERTIES)

    properties.forEach((key) => {
        const requiredStatuses = obj.CRUD_PROPERTIES[key].required
        expect(requiredStatuses).toBeTruthy()
        expect(Array.isArray(requiredStatuses)).toBeTruthy()

        requiredStatuses.forEach((status) => {
            const isValid = validStatuses.includes(status)
            if (!isValid) {
                console.log(`Status "${status}" is not valid`)
            }
            expect(isValid).toBe(true)
        })
    })
}

describe("Status", () => {
    it("Beleidskeuze required fields contain no invalid Status types", () => {
        checkForInvalidRequiredValues(BELEIDSKEUZES)
    })

    it("Maatregelen required fields contain no invalid Status types", () => {
        checkForInvalidRequiredValues(MAATREGELEN)
    })
})
