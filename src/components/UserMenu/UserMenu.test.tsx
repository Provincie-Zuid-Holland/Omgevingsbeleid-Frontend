import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import UserMenu from './UserMenu'

describe('UserMenu', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <UserMenu {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByTestId('user-menu')
        expect(element).toBeTruthy()
    })
})
