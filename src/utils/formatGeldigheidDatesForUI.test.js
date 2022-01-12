import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

describe('formatGeldigheidDatesForUI', () => {
    it('It formats begin and eind geldigheid dates correctly', () => {
        const crudObject = {
            Begin_Geldigheid: '2021-01-05T00:00:00',
            Eind_Geldigheid: '2030-12-31T23:00:00',
        }

        const formattedCrudObject = formatGeldigheidDatesForUI(crudObject)

        expect(formattedCrudObject).toMatchObject({
            Begin_Geldigheid: '2021-01-05',
            Eind_Geldigheid: '2030-12-31',
        })
    })
})
