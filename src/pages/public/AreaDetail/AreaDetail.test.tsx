import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import AreaDetail from './AreaDetail'

const queryClient = new QueryClient()

describe('AreaDetail', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AreaDetail {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const element = screen.getByText('Derde Gebiedsprogramma')
        expect(element).toBeTruthy()
    })
})
