import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import GraphContext from './../../App/GraphContext'
import Navigation from './Navigation'

jest.mock('./../Network/NetworkGraph', () => () => null)

describe('Navigation', () => {
    const setLoginStateMock = jest.fn()
    const setGraphIsOpenMock = jest.fn()
    const defaultProps = {
        setLoginState: setLoginStateMock,
        loggedIn: false,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <GraphContext.Provider
                    value={{
                        graphIsOpen: false,
                        setGraphIsOpen: setGraphIsOpenMock,
                    }}>
                    <Navigation {...props} />
                </GraphContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const search = screen.getByText('Inloggen')
        expect(search).toBeTruthy()
    })

    it('Toggles the menu', async () => {
        setup()
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
        fireEvent.click(button)
        const popupTitle = await screen.queryByText('Omgevingsvisie')
        expect(popupTitle).toBeTruthy()
    })
})
