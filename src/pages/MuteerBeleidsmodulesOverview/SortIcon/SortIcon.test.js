import { render, screen, prettyDOM } from '@testing-library/react'
import React from 'react'
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

    const setup = (customProps) => {
        const props = customProps ? customProps : defaultProps
        render(<SortIcon {...props} />)
        const svgIcon = screen.queryByRole('img', { hidden: true })
        return { svgIcon }
    }

    it('should not render if active sorting is undefined', () => {
        const { svgIcon } = setup({})
        expect(svgIcon).toBeFalsy()
    })

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
