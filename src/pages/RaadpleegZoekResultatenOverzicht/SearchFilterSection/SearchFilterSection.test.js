import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import SearchFilterSection from './SearchFilterSection'

describe('SearchFilterSection', () => {
    const defaultProps = {
        loaded: true,
        searchFiltersOnly: null,
        onPageFilters: {
            beleidskeuzes: { name: 'beleidskeuzes', checked: true, count: 3 },
            maatregelen: { name: 'maatregelen', checked: false, count: 4 },
            beleidsregels: { name: 'beleidsregels', checked: true, count: 1 },
            beleidsdoelen: { name: 'beleidsdoelen', checked: true, count: 1 },
            belangen: { name: 'belangen', checked: true, count: 1 },
            filterArray: [
                'beleidskeuzes',
                'maatregelen',
                'beleidsregels',
                'beleidsdoelen',
                'belangen',
            ],
        },
        filters: [
            'beleidskeuzes',
            'beleidsdoelen',
            'maatregelen',
            'beleidsregels',
        ],
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<SearchFilterSection {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsvisie')
        expect(element).toBeTruthy()
    })
})
