import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

import Verordening from './Verordening'

const queryClient = new QueryClient()

describe('Verordening', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const path = `/detail/verordening`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[path]}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route
                            path={path}
                            element={
                                <>
                                    <div id="top-navigation" />
                                    <Verordening {...props} />
                                </>
                            }
                        />
                    </Routes>
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Verordening')
        expect(element).toBeTruthy()
    })
})
