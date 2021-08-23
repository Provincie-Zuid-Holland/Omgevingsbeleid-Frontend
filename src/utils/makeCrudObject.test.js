import makeCrudObject from './makeCrudObject'

describe('makeCrudObject', () => {
    const crudProperties = ['prop1', 'prop2']
    const dimensieConstants = {
        TITLE_SINGULAR: 'Beleidskeuze',
        CRUD_PROPERTIES: {
            prop1: {
                initValue: 'value1',
            },
            prop2: {
                initValue: 'value2',
            },
        },
    }
    const existingObj = {
        prop1: 'existingValue1',
        prop2: 'existingValue2',
        UUID: '0000-0001',
    }

    it('Initializes the correct object when the user wants to create a new object', () => {
        const crudObject = makeCrudObject({ crudProperties, dimensieConstants })
        expect(crudObject).toMatchObject({ prop1: 'value1', prop2: 'value2' })
    })

    it('Initializes the correct object when the user wants to edit an existing object', () => {
        const crudObject = makeCrudObject({
            crudProperties,
            dimensieConstants,
            existingObj,
        })

        expect(crudObject).toMatchObject({
            prop1: 'existingValue1',
            prop2: 'existingValue2',
        })
    })

    it('Initializes the "Aanpassing_Op" property when the modus is "wijzig_vigerend"', () => {
        const modus = 'wijzig_vigerend'
        const crudObject = makeCrudObject({
            crudProperties,
            dimensieConstants,
            existingObj,
            modus,
        })
        expect(crudObject.hasOwnProperty('Aanpassing_Op')).toBeTruthy()
        expect(crudObject['Aanpassing_Op']).toBe('0000-0001')
    })
})
