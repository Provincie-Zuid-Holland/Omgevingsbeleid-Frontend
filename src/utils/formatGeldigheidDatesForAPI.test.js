import formatGeldigheidDatesForAPI from "./formatGeldigheidDatesForAPI"

describe("formatGeldigheidDatesForAPI", () => {
    it("It formats begin and eind geldigheid dates correctly", () => {
        const crudObject = {
            Begin_Geldigheid: "2021-01-05",
            Eind_Geldigheid: "10000-01-01",
        }

        const formattedCrudObject = formatGeldigheidDatesForAPI(crudObject)

        expect(formattedCrudObject).toMatchObject({
            Begin_Geldigheid: new Date("2021-01-05"),
            Eind_Geldigheid: new Date("10000-01-01"),
        })
    })
})
