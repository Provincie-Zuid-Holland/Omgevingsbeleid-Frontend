import filterSortPolicies from './filterSortPolicies'

const policies = [
    { Titel: '#2 test title wow!', Eind_Geldigheid: '2010-01-01' },
    { Titel: '#1 test title wow!', Eind_Geldigheid: '2020-01-01' },
    { Titel: '#0 test title', Eind_Geldigheid: '2030-01-01' },
]

describe('filterSortPolicy', () => {
    it('should filter with a filter query', () => {
        const filteredPolicies = filterSortPolicies({
            policies: policies,
            filterOptions: { filterQuery: '#1 test title wow!' },
        })

        expect(filteredPolicies.length).toBe(1)
        expect(filteredPolicies[0].Titel).toBe('#1 test title wow!')
    })

    it('should filter out archived policies', () => {
        const filteredPolicies = filterSortPolicies({
            policies: policies,
            filterOptions: { filterOutArchived: true },
        })

        expect(filteredPolicies.length).toBe(1)
        expect(filteredPolicies[0].Titel).toBe('#0 test title')
    })

    it('should sort based on a property', () => {
        const filteredPolicies = filterSortPolicies({
            policies: policies,
            sortOptions: {
                property: 'Titel',
                direction: 'asc',
            },
        })

        expect(filteredPolicies.length).toBe(3)
        expect(filteredPolicies[0].Titel).toBe('#0 test title')
        expect(filteredPolicies[1].Titel).toBe('#1 test title wow!')
        expect(filteredPolicies[2].Titel).toBe('#2 test title wow!')
    })

    it('should sort and filter', () => {
        const filteredPolicies = filterSortPolicies({
            policies: policies,
            sortOptions: {
                property: 'Titel',
                direction: 'asc',
            },
            filterOptions: {
                filterQuery: 'wow!',
            },
        })

        expect(filteredPolicies.length).toBe(2)
        expect(filteredPolicies[0].Titel).toBe('#1 test title wow!')
        expect(filteredPolicies[1].Titel).toBe('#2 test title wow!')
    })
})
