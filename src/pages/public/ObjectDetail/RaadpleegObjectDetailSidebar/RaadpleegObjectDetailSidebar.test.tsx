import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import RaadpleegObjectDetailSidebar from './RaadpleegObjectDetailSidebar'

describe('RaadpleegObjectDetailSidebar', () => {
    const defaultProps = {
        dataObject: {
            Status: 'In bewerking',
            Begin_Geldigheid: '2020-08-07T00:00:00Z',
        },
    }

    const setup = (customProps?: any) => {
        const path = `/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
        const initialEntries = `/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Routes>
                    <Route
                        path={path}
                        element={<RaadpleegObjectDetailSidebar {...props} />}
                    />
                </Routes>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Type')
        expect(element).toBeTruthy()
    })

    it('Displays the status if the object is not valid', () => {
        setup({
            dataObject: {
                Status: 'In bewerking',
                Begin_Geldigheid: '2020-08-07T00:00:00Z',
            },
        })
        const element = screen.getByText('In bewerking')
        expect(element).toBeTruthy()
    })

    it('Displays the validity if the object is currently valid', () => {
        setup({
            dataObject: {
                Status: 'Vigerend',
                Begin_Geldigheid: '2020-08-07T00:00:00Z',
            },
        })
        const element = screen.getByText('Vigerend sinds 7 augustus 2020')
        expect(element).toBeTruthy()
    })

    it('Displays the validity if the object will turn valid in the future', () => {
        setup({
            dataObject: {
                Status: 'Vigerend',
                Begin_Geldigheid: '2025-08-07T00:00:00Z',
            },
        })
        const element = screen.getByText('Vigerend vanaf 7 augustus 2025')
        expect(element).toBeTruthy()
    })
})
