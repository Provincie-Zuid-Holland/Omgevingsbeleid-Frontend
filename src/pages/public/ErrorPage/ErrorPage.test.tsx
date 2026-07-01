import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from 'react-error-boundary'
import { MemoryRouter } from 'react-router-dom'

import ErrorPage from './ErrorPage'

const ThrowErrorComponent = () => {
    throw new Error('Error to test the ErrorBoundary and Error Page')
}

const TestComponent = () => {
    return (
        <MemoryRouter>
            <ErrorBoundary FallbackComponent={ErrorPage}>
                <ThrowErrorComponent />
            </ErrorBoundary>
        </MemoryRouter>
    )
}

describe('ErrorPage', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})
    })

    afterEach(() => {
        consoleErrorSpy.mockRestore()
    })

    it('Should show the error page when an error is thrown', () => {
        render(<TestComponent />)

        expect(screen.getByText('Er is iets fout gegaan')).toBeInTheDocument()
    })
})
