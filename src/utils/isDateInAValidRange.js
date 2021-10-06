import { isBefore, isAfter } from "date-fns"

/**
 * Function to check wether the end validity date and the start validity date are between the year 1900 and 2100
 * @param {object} crudObject - Contains the object with the validity date properties
 * @returns {array} - Containing two boolean values indicating the start and end range validity: [startDateIsInValidRange, endDateIsInValidRange]
 */
const isDateInAValidRange = (crudObject) => {
    const startDate = new Date(crudObject.Begin_Geldigheid)
    const endDate = new Date(crudObject.Eind_Geldigheid)

    const minimumDate = new Date("1899")
    const maximumDate = new Date("2100")

    const startDateIsInValidRange =
        isBefore(startDate, maximumDate) && isAfter(startDate, minimumDate)

    const endDateIsInValidRange =
        isBefore(endDate, maximumDate) && isAfter(endDate, minimumDate)

    return [startDateIsInValidRange, endDateIsInValidRange]
}

export { isDateInAValidRange }
