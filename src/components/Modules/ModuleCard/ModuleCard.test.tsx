import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { getModulesModuleIdGetResponseMock } from '@/api/fetchers.msw'

import ModuleCard from './ModuleCard'

describe('ModuleCard', () => {
    const props = getModulesModuleIdGetResponseMock().Module

    const setup = () => {
        render(
            <MemoryRouter>
                <ModuleCard {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(props.Title)
        expect(element).toBeTruthy()
    })
})
