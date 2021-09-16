import deletePropertiesWithNullValue from "./deletePropertiesWithNullValue"

describe("deletePropertiesWithNullValue", () => {
    it("Removes properties with a null value from an object", () => {
        const originalObj = {
            prop1: "value",
            prop2: null,
        }
        const newObj1 = deletePropertiesWithNullValue(originalObj)
        const newObj2 = deletePropertiesWithNullValue(newObj1)
        expect(newObj1).toMatchObject({ prop1: "value" })
        expect(newObj2).toMatchObject({ prop1: "value" })
    })
})
