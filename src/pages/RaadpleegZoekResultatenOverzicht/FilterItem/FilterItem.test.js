import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import FilterItem from './FilterItem'

describe('FilterItem', () => {
    const handleFilterMock = jest.fn()
    const defaultProps = {
        handleFilter: handleFilterMock,
        checked: true,
        item: 'beleidskeuzes',
        count: 10,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<FilterItem {...props} />)
    }

    it('Component renders', () => {
        setup()

        const element = screen.getByText('Beleidskeuze (10)')
        expect(element).toBeTruthy()
    })
})
