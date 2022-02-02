import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import UserContext from '../../App/UserContext'
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

    it('Displays data after loading', async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.getAllByRole('img'), {
            timeout: 5000,
        })

        const addNewBeleidskeuze = await screen.findByText(
            '+ Voeg Beleidskeuze Toe'
        )
        const addNewMaatregel = await screen.findByText('+ Voeg Maatregel Toe')

        expect(addNewBeleidskeuze).toBeTruthy()
        expect(addNewMaatregel).toBeTruthy()
    })
})
