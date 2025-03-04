import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { getModulesModuleIdGetResponseMock } from '@/api/fetchers.msw'
import AuthProvider from '@/context/AuthContext'

import ModuleCard from './ModuleCard'

describe('ModuleCard', () => {
    const queryClient = new QueryClient()

    const props = getModulesModuleIdGetResponseMock().Module

    const setup = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AuthProvider>
                        <ModuleCard {...props} />
                    </AuthProvider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(props.Title)
        expect(element).toBeTruthy()
    })
})
