import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import ModuleCard from './ModuleCard'

describe('ModuleCard', () => {
    const defaultProps = {
        title: 'Test',
        link: '/',
        description: '',
        status: '',
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <ModuleCard {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test')
        expect(element).toBeTruthy()
    })
})
