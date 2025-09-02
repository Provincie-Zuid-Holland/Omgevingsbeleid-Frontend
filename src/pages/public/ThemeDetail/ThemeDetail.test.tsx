import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { getBeleidsdoelListValidLineagesResponseMock } from '@/api/fetchers.msw'

import ThemeDetail from './ThemeDetail'

const queryClient = new QueryClient()

describe('ThemeDetail', () => {
    const beleidsdoelen = getBeleidsdoelListValidLineagesResponseMock()
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/omgevingsprogramma/thematische-programmas/:id`
        const initialEntries = `/omgevingsprogramma/thematische-programmas/${beleidsdoelen.results[0].UUID}`

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[initialEntries]}>
                    <Routes>
                        <Route
                            path={path}
                            element={<ThemeDetail {...props} />}
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
                name: beleidsdoelen.results[0].Title,
                level: 1,
            })
            expect(element).toBeTruthy()
        })
    })
})
