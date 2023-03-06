import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    render,
    within,
    screen,
    waitFor,
    fireEvent,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import { AuthContext } from '@/context/AuthContext'
import { ambities } from '@/mocks/data/ambities'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'
import { maatregelen } from '@/mocks/data/maatregelen'

import AppRoutes from './AppRoutes'

describe('AppRoutes', () => {
    const queryClient = new QueryClient()

    const user = {
        Email: 'janedoe@mail.com',
        Gebruikersnaam: 'Jane Doe',
        Rol: 'Functioneel beheerder',
        UUID: '0001',
    }

    const defaultProps = {}

    const setup = (customProps: any, customUser?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/muteer/dashboard']}>
                    <AuthContext.Provider
                        value={
                            customUser !== undefined ? customUser : { user }
                        }>
                        <AppRoutes {...props} />
                    </AuthContext.Provider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    const navigateToMenuItem = (item: string) => {
        const sideNav = screen.getByRole('navigation')
        const menuItem = within(sideNav).getByText(item)
        fireEvent.click(menuItem)
    }

    const getHeaderTitle = (name: string, level: number) =>
        screen.getByRole('heading', {
            name: name,
            level: level,
        })

    it('User can navigate the authenticated routes', async () => {
        setup({})

        await waitFor(() => {
            getHeaderTitle('Mijn beleid', 2)
        })

        navigateToMenuItem('Mijn beleid')

        expect(getHeaderTitle('Mijn beleid', 2)).toBeInTheDocument()
    })

    it('User can navigate to a beleidskeuze page', async () => {
        setup({})

        navigateToMenuItem('Beleidskeuzes')

        await waitFor(() => {
            screen.getByText('Nieuwe beleidskeuze')
        })

        fireEvent.click(screen.getByText('Nieuwe beleidskeuze'))

        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        expect(
            getHeaderTitle('Voeg een nieuwe beleidskeuze toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar beleidskeuzes'))

        const firstBeleidskeuzeTitle = beleidskeuzes[0].Titel || ''

        await waitFor(() => {
            screen.getByText(firstBeleidskeuzeTitle)
        })
    })

    it('User can navigate to the maatregel pages', async () => {
        setup({})

        navigateToMenuItem('Maatregelen')

        await waitFor(() => {
            screen.getByText('Nieuwe maatregel')
        })

        fireEvent.click(screen.getByText('Nieuwe maatregel'))

        expect(
            getHeaderTitle('Voeg een nieuwe maatregel toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar maatregelen'))

        const firstMaatregelTitle = maatregelen[0].Titel

        await screen.findByText(firstMaatregelTitle)
    })

    it('User can navigate to the other object pages', async () => {
        setup({})

        navigateToMenuItem('Ambities')

        await waitFor(() => {
            screen.getByText('Nieuwe ambitie')
        })

        fireEvent.click(screen.getByText('Nieuwe ambitie'))

        expect(
            getHeaderTitle('Voeg een nieuwe ambitie toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar ambities'))

        const firstAmbitieTitle = ambities[0].Titel

        await waitFor(() => {
            screen.getByText(firstAmbitieTitle)
        })
    })

    it('User can navigate to the beleidsrelatie pages', async () => {
        setup({})

        navigateToMenuItem('Beleidsrelaties')

        await waitFor(() => {
            screen.getByText(beleidskeuzes[0].Titel || '')
        })

        fireEvent.click(screen.getByText(beleidskeuzes[0].Titel || ''))

        fireEvent.click(screen.getByText('Verzoeken'))
        fireEvent.click(screen.getByText('Afgewezen'))
        fireEvent.click(screen.getByText('Verbroken'))
        fireEvent.click(screen.getByText('Nieuwe relatie'))
        expect(screen.getByText('Nieuwe relatie')).toBeInTheDocument()
    })

    it('User can navigate to the beleidsmodules pages', async () => {
        setup({})

        navigateToMenuItem('Beleidsmodules')

        await waitFor(() => {
            screen.getByText('Nieuwe beleidsmodule')
        })

        fireEvent.click(screen.getByText('Nieuwe beleidsmodule'))

        fireEvent.click(screen.getByText('Terug naar beleidsmodules'))

        await waitFor(() => {
            screen.getByText('Nieuwe beleidsmodule')
        })
    })
})
