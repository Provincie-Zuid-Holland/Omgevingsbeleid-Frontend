import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'

import Pagination from './Pagination'

interface setupProps {
    [key: string]: any
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: 'localhost:3000/example/path',
    }),
}))

describe('Pagination', () => {
    const setSearchResultsMock = jest.fn()
    const setOnPageFiltersMock = jest.fn()

    const defaultProps = {
        type: 'text',
        searchResults: [{}, {}],
        setSearchResults: setSearchResultsMock,
        setOnPageFilters: setOnPageFiltersMock,
        limit: 1,
        total: 2,
    }

    const setup = (customProps?: setupProps) => {
        const props = customProps
            ? { ...defaultProps, ...customProps }
            : defaultProps
        render(
            <BrowserRouter>
                <Pagination {...props} />
            </BrowserRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Meer resultaten Laden')
        expect(element).toBeTruthy()
    })
})
