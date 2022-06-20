import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import allDimensies from '@/constants/dimensies'
import { AuthContext } from '@/context/AuthContext'

import UniversalObjectCRUD from './UniversalObjectCRUD'

const dimensions = [
    'AMBITIES',
    'BELANGEN',
    'BELEIDSREGELS',
    'MAATREGELEN',
    'BELEIDSDOELEN',
    'THEMAS',
    'BELEIDSKEUZES',
]

const authUser = {
    UUID: '0000-0000-0000-0000',
}

const setup = (dimension: keyof typeof allDimensies, type?: string) => {
    const slugCreateNew = allDimensies[dimension].SLUG_CREATE_NEW
    const slugOverview = allDimensies[dimension].SLUG_OVERVIEW

    const urlPATCH = `/muteer/${slugOverview}/edit/1`
    const urlPOST = `/muteer/${slugOverview}/${slugCreateNew}`

    const pathPATCH = `/muteer/${slugOverview}/edit/:single`
    const pathPOST = `/muteer/${slugOverview}/${slugCreateNew}`

    const path = type === 'POST' ? pathPOST : pathPATCH
    const initialEntries = type === 'POST' ? urlPOST : urlPATCH

    render(
        <MemoryRouter initialEntries={[initialEntries]}>
            <AuthContext.Provider value={{ user: authUser } as any}>
                <Routes>
                    <Route
                        path={path}
                        element={
                            <UniversalObjectCRUD
                                dimensieConstants={allDimensies[dimension]}
                            />
                        }
                    />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    )
}

describe('UniversalObjectCRUD', () => {
    dimensions
        .filter((e, i) => i === 0)
        .forEach(dimension => {
            /*
            it(`Should render for dimension ${dimension}`, async () => {
                await act(async () => {
                    setup(dimension as keyof typeof allDimensies)
                })
                await waitFor(() => screen.getByText(`Opslaan`))
            })

            it(`User should be able to PATCH an existing ${dimension}`, async () => {
                await act(async () => {
                    setup(dimension as keyof typeof allDimensies, 'PATCH')
                })
                await waitFor(() => screen.getByText(`Opslaan`))
                fireEvent.click(screen.getByText(`Opslaan`))
            })
            */

            it(`User should be able to POST a new ${dimension}`, async () => {
                window.scroll = jest.fn()

                await act(async () => {
                    setup(dimension as keyof typeof allDimensies, 'POST')
                })

                await waitFor(() => screen.getByText(`Opslaan`))
                const titelInput = screen.getByPlaceholderText('Titel')

                fireEvent.change(titelInput, {
                    target: { value: 'Test Titel' },
                })

                fireEvent.click(screen.getByText(`Opslaan`))
            })
        })
})
