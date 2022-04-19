import isEndDateBeforeStartDate from './isEndDateBeforeStartDate'

describe('isEndDateBeforeStartDate', () => {
    const firstDate = '01/01/2010'
    const laterDate = '01/01/2020'

    it('returns false when end date IS NOT before start date', () => {
        const result = isEndDateBeforeStartDate({
            Begin_Geldigheid: firstDate,
            Eind_Geldigheid: laterDate,
        })
        expect(result).toBeFalsy()
    })

    it('returns true when end date IS before start date', () => {
        const result = isEndDateBeforeStartDate({
            Begin_Geldigheid: laterDate,
            Eind_Geldigheid: firstDate,
        })
        expect(result).toBeTruthy()
    })
})
