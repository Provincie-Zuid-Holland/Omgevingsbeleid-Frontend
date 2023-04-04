import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import Navigation from './Navigation'

describe('Navigation', () => {
    const setLoginStateMock = jest.fn()
    const defaultProps = {
        setLoginState: setLoginStateMock,
        loggedIn: false,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <Navigation {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const search = screen.getByText('Inloggen')
        expect(search).toBeTruthy()
    })

    it('Toggles the menu', () => {
        setup()
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
        fireEvent.click(button)
        const popupTitle = screen.queryByText('Omgevingsvisie')
        expect(popupTitle).toBeTruthy()
    })
})
