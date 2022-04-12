import {
    render,
    waitForElementToBeRemoved,
    screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import AuthProvider from '@/context/AuthContext'

import MuteerUniversalObjectDetailWithStatuses from './MuteerUniversalObjectDetailWithStatuses'

const queryClient = new QueryClient()

describe('MuteerUniversalObjectDetailWithStatuses', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
    }

    const setup = (customProps?: any) => {
        const path = `/muteer/beleidskeuzes/:single`
        const initialEntries = `/muteer/beleidskeuzes/728`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Routes>
                            <Route
                                path={path}
                                element={
                                    <MuteerUniversalObjectDetailWithStatuses
                                        {...props}
                                    />
                                }
                            />
                        </Routes>
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup()
        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const header = screen.getByText('Bovenregionaal warmtenetwerk')
        expect(header).toBeTruthy()
    })
})
