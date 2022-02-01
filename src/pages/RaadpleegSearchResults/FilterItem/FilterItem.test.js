import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import FilterItem from './FilterItem'

describe('FilterItem', () => {
    const setOnPageFiltersMock = jest.fn()
    const defaultProps = {
        checked: true,
        item: 'beleidskeuzes',
        count: 10,
        setOnPageFilters: setOnPageFiltersMock,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<FilterItem {...props} />)
    }

    it('Component renders and displays count', () => {
        setup()
        const element = screen.getByText(`Beleidskeuzes (10)`)
        expect(element).toBeTruthy()
    })
})
