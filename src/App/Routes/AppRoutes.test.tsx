import {
    render,
    within,
    screen,
    waitFor,
    fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import { AuthContext } from '@/context/AuthContext'
import { ambities } from '@/mocks/data/ambities'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'
import { beleidsmodules } from '@/mocks/data/beleidsmodules'
import { maatregelen } from '@/mocks/data/maatregelen'
import { verordeningstructuur } from '@/mocks/data/verordeningstructuur'

import AppRoutes from './AppRoutes'

describe('AppRoutes', () => {
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
            <MemoryRouter initialEntries={['/muteer/dashboard']}>
                <AuthContext.Provider
                    value={customUser !== undefined ? customUser : { user }}>
                    <AppRoutes {...props} />
                </AuthContext.Provider>
            </MemoryRouter>
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

        // User can navigate to the verordening pages
        navigateToMenuItem('Verordening')

        await waitFor(() => {
            screen.getByText('+ Voeg Verordening Toe')
        })

        fireEvent.click(screen.getByText('+ Voeg Verordening Toe'))

        expect(
            getHeaderTitle('Voeg een nieuwe verordening toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar verordening'))

        const firstVerordeningTitle = verordeningstructuur[0].Titel

        await waitFor(() => {
            expect(getHeaderTitle(firstVerordeningTitle, 2)).toBeInTheDocument()
        })

        fireEvent.click(getHeaderTitle(firstVerordeningTitle, 2))

        await waitFor(() => {
            expect(screen.getByText('Bewerken')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByText('Bewerken'))
    })

    it('User can navigate to a beleidskeuze page', async () => {
        setup({})

        navigateToMenuItem('Beleidskeuzes')

        await waitFor(() => {
            screen.getByText('+ Voeg Beleidskeuze Toe')
        })

        fireEvent.click(screen.getByText('+ Voeg Beleidskeuze Toe'))

        expect(
            getHeaderTitle('Voeg een nieuwe beleidskeuze toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar beleidskeuzes'))

        const firstBeleidskeuzeTitle = beleidskeuzes[0].Titel

        await waitFor(() => {
            screen.getByText(firstBeleidskeuzeTitle)
        })

        fireEvent.click(screen.getByText(firstBeleidskeuzeTitle))
    })

    it('User can navigate to the maatregel pages', async () => {
        setup({})

        navigateToMenuItem('Maatregelen')

        await waitFor(() => {
            screen.getByText('+ Voeg Maatregel Toe')
        })

        fireEvent.click(screen.getByText('+ Voeg Maatregel Toe'))

        expect(
            getHeaderTitle('Voeg een nieuwe maatregel toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar maatregelen'))

        const firstMaatregelTitle = maatregelen[0].Titel

        await waitFor(() => {
            screen.getByText(firstMaatregelTitle)
        })

        fireEvent.click(screen.getByText(firstMaatregelTitle))

        await waitFor(() => {
            screen.getByText('Bewerk Maatregel')
        })

        fireEvent.click(screen.getByText('Bewerk Maatregel'))
    })

    it('User can navigate to the other object pages', async () => {
        setup({})

        navigateToMenuItem('Ambities')

        await waitFor(() => {
            screen.getByText('+ Voeg Ambitie Toe')
        })

        fireEvent.click(screen.getByText('+ Voeg Ambitie Toe'))

        expect(
            getHeaderTitle('Voeg een nieuwe ambitie toe', 1)
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar ambities'))

        const firstAmbitieTitle = ambities[0].Titel

        await waitFor(() => {
            screen.getByText(firstAmbitieTitle)
        })

        fireEvent.click(screen.getByText(firstAmbitieTitle))

        await waitFor(() => {
            screen.getByText('10 mei 2021')
        })
    })

    it('User can navigate to the beleidsrelatie pages', async () => {
        setup({})

        navigateToMenuItem('Beleidsrelaties')

        await waitFor(() => {
            screen.getByText(beleidskeuzes[0].Titel)
        })

        fireEvent.click(screen.getByText(beleidskeuzes[0].Titel))

        fireEvent.click(screen.getByText('Verzoeken'))
        fireEvent.click(screen.getByText('Afgewezen'))
        fireEvent.click(screen.getByText('Verbroken'))
        fireEvent.click(screen.getByText('Nieuwe relatie'))
        expect(
            screen.getByText('Voeg een nieuwe beleidsrelatie toe')
        ).toBeInTheDocument()
    })

    it('User can navigate to the beleidsmodules pages', async () => {
        setup({})

        navigateToMenuItem('Beleidsmodules')

        await waitFor(() => {
            screen.getByText('+ Voeg Beleidsmodule Toe')
        })

        fireEvent.click(screen.getByText('+ Voeg Beleidsmodule Toe'))

        expect(
            screen.getByText('Voeg een nieuwe module toe')
        ).toBeInTheDocument()

        fireEvent.click(screen.getByText('Terug naar beleidsmodules'))

        await waitFor(() => {
            screen.getByText('+ Voeg Beleidsmodule Toe')
        })

        fireEvent.click(screen.getByText(beleidsmodules[0].Titel))

        waitFor(() => {
            getHeaderTitle(beleidsmodules[0].Titel, 1)
        })

        fireEvent.click(screen.getByText('Terug naar overzicht'))
    })
})
