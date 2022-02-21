import './../../../mocks/matchMedia'

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import SearchFilterSection from './SearchFilterSection'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}))

describe('SearchFilterSection', () => {
    const defaultProps = {
        loaded: true,
        onPageFilters: {
            filterState: {
                beleidskeuzes: {
                    name: 'beleidskeuzes',
                    checked: true,
                    count: 3,
                },
                maatregelen: { name: 'maatregelen', checked: true, count: 4 },
                beleidsregels: {
                    name: 'beleidsregels',
                    checked: true,
                    count: 1,
                },
                beleidsdoelen: {
                    name: 'beleidsdoelen',
                    checked: true,
                    count: 1,
                },
                belangen: { name: 'belangen', checked: true, count: 1 },
            },
            availableFilters: [
                'beleidskeuzes',
                'maatregelen',
                'beleidsregels',
                'beleidsdoelen',
                'belangen',
            ],
        },
        setOnPageFilters: jest.fn(),
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
