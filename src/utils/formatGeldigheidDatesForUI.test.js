import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

describe('formatGeldigheidDatesForUI', () => {
    it('It formats begin and eind geldigheid dates correctly', () => {
        const crudObject = {
            Begin_Geldigheid: '2021-01-05T00:00:00Z',
            Eind_Geldigheid: '9999-12-31T23:00:00Z',
        }

        const formattedCrudObject = formatGeldigheidDatesForUI(crudObject)

        expect(formattedCrudObject).toMatchObject({
            Begin_Geldigheid: '2021-01-05',
            Eind_Geldigheid: '10000-01-01',
        })
    })
})
