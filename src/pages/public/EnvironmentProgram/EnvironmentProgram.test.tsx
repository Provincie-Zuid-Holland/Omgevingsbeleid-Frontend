import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import EnvironmentProgram from './EnvironmentProgram'

describe('EnvironmentProgram', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <EnvironmentProgram {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Bekijk de thematische programma’s')
        expect(element).toBeTruthy()
    })
})
