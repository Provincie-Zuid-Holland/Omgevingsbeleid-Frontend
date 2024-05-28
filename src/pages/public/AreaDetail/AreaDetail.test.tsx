import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { getGebiedsprogrammasValidGetResponseMock } from '@/api/fetchers.msw'

import AreaDetail from './AreaDetail'

const queryClient = new QueryClient()

describe('AreaDetail', () => {
    const gebiedsprogrammas = getGebiedsprogrammasValidGetResponseMock()
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/omgevingsprogramma/gebiedsprogrammas/:id`
        const initialEntries = `/omgevingsprogramma/gebiedsprogrammas/${gebiedsprogrammas.results[0].UUID}`

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[initialEntries]}>
                    <Routes>
                        <Route
                            path={path}
                            element={<AreaDetail {...props} />}
                        />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()

        waitFor(() => {
            const element = screen.getByRole('heading', {
                name: gebiedsprogrammas.results[0].Title,
                level: 1,
            })
            expect(element).toBeTruthy()
        })
    })
})
