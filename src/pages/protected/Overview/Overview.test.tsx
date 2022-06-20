import {
    render,
    screen,
    waitForElementToBeRemoved,
    fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import { AuthContext } from '@/context/AuthContext'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'

import MuteerOverview from './Overview'

describe('MuteerOverview', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
        hideAddObject: false,
    }

    const queryClient = new QueryClient()

    const setup = (customProps?: any, user: any = {}) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <AuthContext.Provider value={{ ...user }}>
                        <MuteerOverview {...props} />
                    </AuthContext.Provider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders all objects', async () => {
        setup({}, { user: { UUID: '0001' } })

        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        // ✅ All objects in the lineage are displayed
        beleidskeuzes.forEach(beleidskeuze => {
            const beleidskeuzeTitle = screen.getByText(beleidskeuze.Titel || '')
            expect(beleidskeuzeTitle).toBeInTheDocument()
        })

        // ✅ User can filter objects
        const filterInput = screen.getByPlaceholderText('Zoeken in lijst')
        fireEvent.change(filterInput, { target: { value: 'test' } })

        beleidskeuzes.forEach(beleidskeuze => {
            const beleidskeuzeTitle = screen.queryByText(
                beleidskeuze.Titel || ''
            )
            expect(beleidskeuzeTitle).toBeFalsy()
        })

        fireEvent.change(filterInput, {
            target: { value: 'Bovenregionaal warmtenetwerk' },
        })

        beleidskeuzes
            .filter(
                beleidskeuze =>
                    beleidskeuze.Titel !== 'Bovenregionaal warmtenetwerk'
            )
            .forEach(beleidskeuze => {
                const beleidskeuzeTitle = screen.queryByText(
                    beleidskeuze.Titel || ''
                )
                expect(beleidskeuzeTitle).toBeFalsy()
            })

        expect(
            screen.getByText('Bovenregionaal warmtenetwerk')
        ).toBeInTheDocument()

        // ✅ User can click a button to create a new object
        const createObjectButton = screen.getByText('Nieuwe beleidskeuze')
        expect(createObjectButton).toHaveAttribute(
            'href',
            '/muteer/beleidskeuzes/nieuwe-beleidskeuze'
        )

        // ✅ User can click a a list item to go to the detail view
        const objectListItem = screen
            .getByText('Bovenregionaal warmtenetwerk')
            .closest('a')

        expect(objectListItem).toBeTruthy()

        expect(objectListItem).toHaveAttribute(
            'href',
            '/muteer/beleidskeuzes/728'
        )

        // ✅ User can go back to the dashboard
        const backButton = screen.getByText('Terug naar dashboard').closest('a')
        expect(backButton).toHaveAttribute('href', '/muteer/dashboard')

        // ✅ User can toggle the dropdown and see more actions
        const dropdownButton = screen.getByRole('button', {
            name: 'toggle-dropdown',
        })

        fireEvent.click(dropdownButton)

        expect(screen.getByText('Status aanpassen')).toBeInTheDocument()
        expect(screen.getByText('Raadpleegomgeving')).toBeInTheDocument()
        expect(screen.getByText('Toevoegen aan module')).toBeInTheDocument()
    })
})
