import '@testing-library/jest-dom'
import {
    fireEvent,
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import { verordeningstructuur } from '@/mocks/data/verordeningstructuur'

import VerordeningEdit from './VerordeningEdit'

describe('VerordeningEdit', () => {
    const queryClient = new QueryClient()
    const verordening = verordeningstructuur[0]
    const verordeningID = verordening.ID

    const setup = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter
                    initialEntries={[`/muteer/verordeningen/${verordeningID}`]}>
                    <VerordeningEdit />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('User can use the verordening edit page', async () => {
        /** This test is based on the mock data in src/mocks/data/verordeningstructuur.ts */
        setup()

        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        /** Check if the header is displayed */
        const structureTitle = verordening.Titel
        expect(screen.getByText(structureTitle)).toBeInTheDocument()

        /** Check if the chapters are displayed */
        const verordeningChapters = verordening.Structuur.Children

        verordeningChapters.forEach(chapter => {
            expect(
                screen.getByText(
                    `Hoofdstuk ${chapter.Volgnummer} - ${chapter.Titel}`
                )
            ).toBeInTheDocument()
        })

        /** Check if the buttons in the sidebar are active */
        const addSectionBtn = screen.getByRole('button', {
            name: 'Voeg een sectie toe',
        })
        const changeOrderBtn = screen.getByRole('button', {
            name: 'Wijzig de volgorde',
        })
        const editVerordeningBtn = screen.getByRole('button', {
            name: 'Bewerk de verordening',
        })

        expect(editVerordeningBtn).toBeInTheDocument()
        expect(changeOrderBtn).toBeInTheDocument()
        expect(addSectionBtn).toBeInTheDocument()

        /** User can toggle the states to add sections */
        const addSectionsText =
            'Je kunt op dit moment onderdelen toevoegen. Klik op de plek waar je een onderdeel wilt toevoegen.'

        expect(screen.queryByText(addSectionsText)).toBeFalsy()

        fireEvent.click(addSectionBtn)

        expect(screen.queryByText(addSectionsText)).toBeInTheDocument()

        expect(screen.getByText('Annuleren')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Annuleren'))

        expect(
            screen.getByRole('button', { name: 'Voeg een sectie toe' })
        ).toBeInTheDocument()

        /** User can navigate to a chapter */
        const firstChapter = verordeningChapters[0]

        fireEvent.click(
            screen.getByText(
                `Hoofdstuk ${firstChapter.Volgnummer} - ${firstChapter.Titel}`
            )
        )

        /** When a chapter is active, there should not be the option to go to the verordening edit page */
        expect(
            screen.queryByRole('button', { name: 'Bewerk de verordening' })
        ).toBeFalsy()

        /** User can edit the first verordening section in chapter 1 */
        const dropdownButtons = screen.getAllByTestId('toggle-dropdown')

        fireEvent.click(dropdownButtons[0])

        expect(screen.getByText('Wijzigen'))

        fireEvent.click(screen.getByText('Wijzigen'))

        /** Expect verordening sidebar to appear */
        expect(await screen.findByText('Eerste Eigenaar')).toBeInTheDocument()
        expect(screen.getByText('Tweede Eigenaar')).toBeInTheDocument()
        expect(screen.getByText('Opdrachtgever')).toBeInTheDocument()
        expect(
            screen.getByText('Eerste portefeuillehouder')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Tweede portefeuillehouder')
        ).toBeInTheDocument()
        expect(
            screen.getByText('Tweede portefeuillehouder')
        ).toBeInTheDocument()
        expect(screen.getByText('Datum inwerkingtreding')).toBeInTheDocument()
        expect(screen.getByText('Datum uitwerkingtreding')).toBeInTheDocument()
        expect(screen.getByText('Gebied')).toBeInTheDocument()
    })
})
