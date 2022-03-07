import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

import RaadpleegVerordening from './RaadpleegVerordening'

const queryClient = new QueryClient()

describe('RaadpleegVerordening', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const path = `/detail/verordening`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[path]}>
                <QueryClientProvider client={queryClient}>
                    <Route path={path}>
                        <div id="top-navigation" />
                        <RaadpleegVerordening {...props} />
                    </Route>
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
