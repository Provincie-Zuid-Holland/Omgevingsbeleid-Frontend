import '@testing-library/jest-dom'
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
    beforeEach(() => {
        render(<TestComponent />)
    })

    it('Should show the error page when an error is thrown', () => {
        const errorPageTitle = screen.getByText('Er is iets fout gegaan')
        expect(errorPageTitle).toBeTruthy()
    })
})
