import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

import { AuthContext } from '@/context/AuthContext'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'

import MuteerBeleidsrelaties from './MuteerBeleidsrelaties'

describe('MuteerBeleidsrelaties', () => {
    const defaultProps = {}

    const setup = (
        customProps?: any,
        customPath?: string,
        customInitialEntries?: string
    ) => {
        const props = { ...defaultProps, ...customProps }
        const path = customPath ? customPath : `/muteer/beleidsrelaties`
        const initialEntries = customInitialEntries
            ? customInitialEntries
            : `/muteer/beleidsrelaties`

        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <AuthContext.Provider value={{ user: { UUID: '0001' } } as any}>
                    <Routes>
                        <Route
                            path={path}
                            element={<MuteerBeleidsrelaties {...props} />}
                        />
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders the overview page', () => {
        setup()
        const element = screen.getByText('Beleidskeuzes')
        expect(element).toBeTruthy()
    })

    it('Component renders the detail page', async () => {
        setup(
            {},
            `/muteer/beleidsrelaties/:UUID`,
            `/muteer/beleidsrelaties/${beleidskeuzes[0].UUID}`
        )
        const title = await screen.findByText(beleidskeuzes[0].Titel!)
        expect(title).toBeTruthy()
    })

    it('User can navigate back to the overview page', async () => {
        setup(
            {},
            `/muteer/beleidsrelaties/:UUID`,
            `/muteer/beleidsrelaties/${beleidskeuzes[0].UUID}`
        )
        const title = await screen.findByText(beleidskeuzes[0].Titel!)
        expect(title).toBeTruthy()

        const backBtn = screen.getByText('Terug naar overzicht')
        fireEvent.click(backBtn)

        expect(screen.queryByText(beleidskeuzes[0].Titel!)).toBeFalsy()
    })
})
