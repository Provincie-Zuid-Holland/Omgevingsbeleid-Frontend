import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import { getModulesModuleIdGetMock } from '@/api/fetchers.msw'

import ModuleCard from './ModuleCard'

describe('ModuleCard', () => {
    const props = getModulesModuleIdGetMock().Module

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
