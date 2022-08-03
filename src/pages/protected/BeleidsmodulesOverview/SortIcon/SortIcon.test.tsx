import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import SortIcon from './SortIcon'

describe('SortIcon', () => {
    const defaultProps = {
        sorting: {
            activeSorting: 'property',
            property: true,
        },
        property: 'property',
    }

    const inactiveProps = {
        sorting: {
            activeSorting: 'other property',
            property: false,
        },
        property: 'property',
    }

    const setup = (customProps?: any) => {
        const props = customProps ? customProps : defaultProps
        render(<SortIcon {...props} />)
        const svgIcon = screen.getByTestId('sort-icon')
        return { svgIcon }
    }

    it('should render', () => {
        const { svgIcon } = setup()
        expect(svgIcon).toBeTruthy()
    })

    it('should display a darker text gray if active', () => {
        const { svgIcon } = setup()
        expect(svgIcon).toHaveClass('text-gray-700')
    })

    it('should display a lighter text gray if inactive', () => {
        const { svgIcon } = setup(inactiveProps)
        expect(svgIcon).toHaveClass('text-gray-400')
    })

    it('should display a down icon if the property is false', () => {
        const { svgIcon } = setup(inactiveProps)
        expect(svgIcon).toHaveClass('fa-sort-amount-down')
    })

    it('should display an up icon if the property is true', () => {
        const { svgIcon } = setup()
        expect(svgIcon).toHaveClass('fa-sort-amount-up')
    })
})
