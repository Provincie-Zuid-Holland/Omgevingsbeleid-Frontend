import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { gebiedsprogrammas } from '@/mocks/data/gebiedsprogrammas'

import AreaDetail from './AreaDetail'

const queryClient = new QueryClient()

describe('AreaDetail', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/omgevingsprogramma/gebiedsprogrammas/:id`
        const initialEntries = `/omgevingsprogramma/gebiedsprogrammas/${gebiedsprogrammas[0].UUID}`

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

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const element = screen.getByRole('heading', {
            name: gebiedsprogrammas[0].Titel,
            level: 1,
        })
        expect(element).toBeTruthy()
    })
})