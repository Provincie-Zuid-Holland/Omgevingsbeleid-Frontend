import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import ThemeOverview from './ThemeOverview'

const queryClient = new QueryClient()

describe('ThemeOverview', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ThemeOverview {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const element = screen.getByText('De 3 thematische programma’s')
        expect(element).toBeTruthy()
    })
})
