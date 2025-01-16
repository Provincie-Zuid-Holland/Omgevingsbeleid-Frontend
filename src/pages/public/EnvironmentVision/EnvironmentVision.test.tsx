import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import EnvironmentVision from './EnvironmentVision'

describe('EnvironmentVision', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <EnvironmentVision {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsvisie')
        expect(element).toBeTruthy()
    })
})
