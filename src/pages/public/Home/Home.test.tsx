import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Home from './Home'

describe('Home', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <Home {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsbeleid')
        expect(element).toBeTruthy()
    })
})
