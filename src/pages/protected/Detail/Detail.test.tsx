import {
    render,
    waitForElementToBeRemoved,
    screen,
    within,
    fireEvent,
} from '@testing-library/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import { beleidskeuzesLineage } from '@/mocks/data/beleidskeuzes'

import MuteerDetail from './Detail'

describe('MuteerDetail', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
    }
    const queryClient = new QueryClient()
    const setup = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/muteer/beleidskeuzes/728']}>
                    <Routes>
                        <Route
                            path="muteer/beleidskeuzes/:single"
                            element={<MuteerDetail {...defaultProps} />}
                        />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('User can view and edit a policy on the detail page', async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'))

        // 👉🏻  Check if the policy cards are displayed
        const titleOfFirstBeleidskeuze = beleidskeuzesLineage[0]?.Titel || ''
        const beleidskeuzeTitles = await screen.findAllByText(
            titleOfFirstBeleidskeuze
        )
        expect(beleidskeuzeTitles).toBeTruthy()

        // 👉🏻  Card displays a status badge of the policy
        const firstBeleidskeuzeContainer = screen.getByTestId(
            `card-${beleidskeuzesLineage[0]?.UUID}`
        )
        const statusBadgeConcept = within(firstBeleidskeuzeContainer).getByText(
            'Ontwerp GS Concept'
        )
        expect(statusBadgeConcept).toBeInTheDocument()

        // 👉🏻  Check if the user can open the dropdown in a policy card
        const dropdownButton = within(firstBeleidskeuzeContainer).getByRole(
            'button'
        )
        expect(dropdownButton).toBeTruthy()
        expect(screen.queryByText('Status aanpassen')).toBeFalsy()
        fireEvent.click(dropdownButton)
        expect(screen.getByText('Status aanpassen')).toBeInTheDocument()
        expect(screen.getByText('Raadpleegomgeving')).toBeInTheDocument()
        expect(screen.getByText('Toevoegen aan module')).toBeInTheDocument()

        // 👉🏻  User can open the popup to change the status
        fireEvent.click(screen.getByText('Status aanpassen'))
        expect(screen.getByText('Status wijzigen')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Annuleren'))
        await waitForElementToBeRemoved(() =>
            screen.getByText('Status wijzigen')
        )

        // 👉🏻  User can open the popup to change the status
        expect(screen.getByText('Toevoegen aan module')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Toevoegen aan module'))
        expect(screen.getByText('Module aanpassen')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Annuleren'))
        await waitForElementToBeRemoved(() =>
            screen.getByText('Module aanpassen')
        )
    })
})
