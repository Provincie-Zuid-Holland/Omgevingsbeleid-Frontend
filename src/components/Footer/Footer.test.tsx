import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Footer from './Footer'

describe('Footer', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <Footer {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Krachtig Zuid-Holland')
        expect(element).toBeTruthy()
    })
})
