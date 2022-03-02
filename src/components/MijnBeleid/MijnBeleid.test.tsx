import {
    render,
    screen,
    waitForElementToBeRemoved,
    waitFor,
    fireEvent,
    prettyDOM,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import UserContext from '@/App/UserContext'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'
import { maatregelen } from '@/mocks/data/maatregelen'

import MijnBeleid from './MijnBeleid'

describe('MijnBeleid', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: { UUID: '0001' } }}>
                    <MijnBeleid {...props} />
                </UserContext.Provider>
            </MemoryRouter>
        )
    }

    it('User can navigate their policies', async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        const addNewBeleidskeuze = await screen.findByText(
            '+ Voeg Beleidskeuze Toe'
        )
        const addNewMaatregel = await screen.findByText('+ Voeg Maatregel Toe')

        expect(addNewBeleidskeuze).toBeTruthy()
        expect(addNewMaatregel).toBeTruthy()

        await waitFor(() => {
            beleidskeuzes.forEach(beleidskeuze => {
                expect(screen.getByText(beleidskeuze.Titel)).toBeInTheDocument()
            })

            maatregelen.forEach(maatregel => {
                expect(screen.getByText(maatregel.Titel)).toBeInTheDocument()
            })
        })
    })
})
