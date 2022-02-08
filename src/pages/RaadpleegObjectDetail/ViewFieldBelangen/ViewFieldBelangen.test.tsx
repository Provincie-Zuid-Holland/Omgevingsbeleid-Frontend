import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'

import ViewFieldBelangen from './ViewFieldBelangen'

describe('ViewFieldBelangen', () => {
    const defaultProps = {
        fieldValue: [
            {
                Koppeling_Omschrijving: 'Belang',
                Object: {
                    ID: 1,
                    UUID: '0000-0001',
                    Begin_Geldigheid: '2021-02-03T00:00:00Z',
                    Eind_Geldigheid: '2021-08-03T00:00:00Z',
                    Created_By: '0001-0000',
                    Created_Date: '2021-02-03T14:02:31.140000Z',
                    Modified_By: '0002-0000',
                    Modified_Date: '2021-02-03T14:02:31.140000Z',
                    Titel: 'Test Nationaal Belang',
                    Omschrijving: 'Omschrijving',
                    Weblink: 'Weblink',
                    Type: 'Nationaal Belang',
                },
            },
            {
                Koppeling_Omschrijving: 'Belang',
                Object: {
                    ID: 1,
                    UUID: '0000-0001',
                    Begin_Geldigheid: '2021-02-03T00:00:00Z',
                    Eind_Geldigheid: '2021-08-03T00:00:00Z',
                    Created_By: '0001-0000',
                    Created_Date: '2021-02-03T14:02:31.140000Z',
                    Modified_By: '0002-0000',
                    Modified_Date: '2021-02-03T14:02:31.140000Z',
                    Titel: 'Test Wettelijke Taak & Bevoegdheid',
                    Omschrijving: 'Omschrijving',
                    Weblink: 'Weblink',
                    Type: 'Wettelijke Taak & Bevoegdheid',
                },
            },
        ],
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/detail/beleidskeuzes/:id`
        const initialEntries = `/detail/beleidskeuzes/463679D5-5257-4979-870F-8B5DDADC6CC1`

        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <ViewFieldBelangen {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()

        const nationaalBelang = screen.getByText('Test Nationaal Belang')
        expect(nationaalBelang).toBeTruthy()

        const taakBevoegdheid = screen.getByText(
            'Test Wettelijke Taak & Bevoegdheid'
        )
        expect(taakBevoegdheid).toBeTruthy()
    })
})
