import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'

import BeleidsrelatiesDetail from './BeleidsrelatiesDetail'

describe('BeleidsrelatiesDetail', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/muteer/beleidsrelaties/:UUID`
        const initialEntries = `/muteer/beleidsrelaties/${beleidskeuzes[0].UUID}`

        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Routes>
                    <Route
                        path={path}
                        element={<BeleidsrelatiesDetail {...props} />}
                    />
                </Routes>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Beleidskeuze')
        expect(element).toBeTruthy()
    })

    it('Component displays object after loading data from the API', async () => {
        setup()
        const title = await screen.findByText(beleidskeuzes[0].Titel || '')
        expect(title).toBeTruthy()
    })

    it('User can switch between tabs', async () => {
        setup()
        const title = await screen.findByText(beleidskeuzes[0].Titel || '')
        expect(title).toBeTruthy()

        const placeholderRelaties = await screen.findByText(
            'Er zijn nog geen beleidsrelaties'
        )
        expect(placeholderRelaties).toBeTruthy()

        const verzoekenTab = await screen.findByText('Verzoeken')
        fireEvent.click(verzoekenTab)
        const placeholderVerzoeken = await screen.findByText(
            'Er zijn nog geen verzoeken'
        )
        expect(placeholderVerzoeken).toBeTruthy()

        const afgewezenTab = await screen.findByText('Afgewezen')
        fireEvent.click(afgewezenTab)
        const placeholderAfgewezen = await screen.findByText(
            'Er zijn nog geen afgewezen beleidsrelaties'
        )
        expect(placeholderAfgewezen).toBeTruthy()

        const verbrokenTab = await screen.findByText('Verbroken')
        fireEvent.click(verbrokenTab)
        const placeholderVerbroken = await screen.findByText(
            'Er zijn nog geen verbroken beleidsrelaties'
        )
        expect(placeholderVerbroken).toBeTruthy()
    })
})
