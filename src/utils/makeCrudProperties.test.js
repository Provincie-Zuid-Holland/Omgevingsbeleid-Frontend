import makeCrudProperties from "./makeCrudProperties"

describe("makeCrudProperties", () => {
    it("returns the keys of an object", () => {
        const dimensieConstants = {
            CRUD_PROPERTIES: {
                propOne: null,
                propTwo: null,
                propThree: null,
            },
        }

        const crudProps = makeCrudProperties(dimensieConstants)
        expect(crudProps).toStrictEqual(["propOne", "propTwo", "propThree"])
    })
})
