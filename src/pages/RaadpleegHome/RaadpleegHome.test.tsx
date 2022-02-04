import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import GraphContext from '@/App/GraphContext'

import RaadpleegHome from './RaadpleegHome'

describe('RaadpleegHome', () => {
    const defaultProps = {}
    const setGraphIsOpenMock = jest.fn()

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <GraphContext.Provider
                    value={{
                        graphIsOpen: false,
                        setGraphIsOpen: setGraphIsOpenMock,
                    }}>
                    <RaadpleegHome {...props} />
                </GraphContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsbeleid')
        expect(element).toBeTruthy()
    })
})