import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import Pagination from './Pagination'

interface setupProps {
    [key: string]: any
}

describe('Pagination', () => {
    const setSearchResultsMock = jest.fn()
    const defaultProps = {
        searchResults: [],
        setSearchResults: setSearchResultsMock,
    }

    const setup = (customProps?: setupProps) => {
        const props = customProps
            ? { ...defaultProps, ...customProps }
            : defaultProps
        render(<Pagination {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Meer resultaten Laden')
        expect(element).toBeTruthy()
    })
})
