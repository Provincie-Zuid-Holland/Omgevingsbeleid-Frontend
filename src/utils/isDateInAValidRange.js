import { isBefore, isAfter } from "date-fns"

/**
 * Function to check wether the end validity date and the start validity date are between the year 1900 and 2100
 * @param {object} date - Contains a Date object
 * @returns boolean - True if it is between the year 1900 and 2100
 */
const isDateInAValidRange = (date) => {
    const minimumDate = new Date("1990")
    const maximumDate = new Date("2100")
    const dateIsInValidRange =
        isBefore(date, maximumDate) && isAfter(date, minimumDate)
    return dateIsInValidRange
}

export { isDateInAValidRange }
