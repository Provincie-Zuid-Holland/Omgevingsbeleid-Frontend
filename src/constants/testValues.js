// Used for test values in above files
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
}
const currentDate = new Date().toISOString().slice(0, 10)
const futureDate = new Date(new Date().setMonth(new Date().getMonth() + 6))
    .toISOString()
    .slice(0, 10)
const currentDateFormatted = new Intl.DateTimeFormat("nl-NL", options).format(
    new Date()
)

export { currentDate, futureDate, currentDateFormatted }
