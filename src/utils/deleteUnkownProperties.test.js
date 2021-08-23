import deleteUnkownProperties from './deleteUnkownProperties'

describe('deleteUnkownProperties', () => {
    const propertiesToRemove = [
        'Modified_By',
        'ID',
        'Created_Date',
        'Modified_Date',
        'Created_By',
        'UUID',
    ]
    it('removes the appropriate properties from an object', () => {
        const originalObj = {
            Modified_By: null,
            ID: null,
            Created_Date: null,
            Modified_Date: null,
            Created_By: null,
            UUID: null,
            propertyThatShouldStay: null,
        }

        const newObj = deleteUnkownProperties(originalObj)

        propertiesToRemove.forEach((property) => {
            expect(newObj.hasOwnProperty(property)).toBeFalsy()
        })
        expect(newObj.hasOwnProperty('propertyThatShouldStay')).toBeTruthy()
        expect(newObj).toMatchObject({ propertyThatShouldStay: null })
    })
})
