import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import RaadpleegDigiToegankelijkheid from './RaadpleegDigiToegankelijkheid'

describe('RaadpleegDigiToegankelijkheid', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegDigiToegankelijkheid {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Toegankelijkheids­verklaring')
        expect(element).toBeTruthy()
    })
})
