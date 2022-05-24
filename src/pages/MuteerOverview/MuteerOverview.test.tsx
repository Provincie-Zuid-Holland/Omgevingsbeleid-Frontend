import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import { AuthContext } from '@/context/AuthContext'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'

import MuteerOverview from './MuteerOverview'

describe('MuteerOverview', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
        hideAddObject: false,
    }

    const queryClient = new QueryClient()

    const setup = (customProps?: any, user: any = {}) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <AuthContext.Provider value={{ ...user }}>
                        <MuteerOverview {...props} />
                    </AuthContext.Provider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders all objects', async () => {
        setup({}, { user: { UUID: '0001' } })

        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        beleidskeuzes.forEach(beleidskeuze => {
            const beleidskeuzeTitle = screen.getByText(beleidskeuze.Titel)
            expect(beleidskeuzeTitle).toBeTruthy()
        })
    })
})
