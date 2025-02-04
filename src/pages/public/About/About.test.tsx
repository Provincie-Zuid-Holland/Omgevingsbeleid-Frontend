import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import About from './About'

describe('About', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <About {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Over platform Omgevingsbeleid')
        expect(element).toBeTruthy()
    })
})
