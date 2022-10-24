import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { beleidsdoelen } from '@/mocks/data/beleidsdoelen'

import ThemeDetail from './ThemeDetail'

const queryClient = new QueryClient()

describe('ThemeDetail', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/omgevingsprogramma/thematische-programmas/:id`
        const initialEntries = `/omgevingsprogramma/thematische-programmas/${beleidsdoelen[0].UUID}`

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

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const element = screen.getByRole('heading', {
            name: beleidsdoelen[0].Titel,
            level: 1,
        })
        expect(element).toBeTruthy()
    })
})
