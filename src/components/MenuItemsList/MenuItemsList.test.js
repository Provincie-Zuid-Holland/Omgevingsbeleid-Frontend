import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import { menuItemsOmgevingsbeleid } from './../../constants/menuItems'
import MenuItemsList from './MenuItemsList'

describe('MenuItemsList', () => {
    const defaultProps = {
        menuItems: menuItemsOmgevingsbeleid,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <MenuItemsList {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        Object.keys(menuItemsOmgevingsbeleid).forEach(key => {
            const element = screen.getByText(key)
            expect(element).toBeTruthy()
        })
    })

    it('Component displays a links for each item', () => {
        setup()
        Object.keys(menuItemsOmgevingsbeleid).forEach(key => {
            const element = screen.getByText(key)
            const link = 'http://localhost' + menuItemsOmgevingsbeleid[key].url
            expect(element.href).toBe(link)
        })
    })
})
