import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import React from 'react'
import MuteerUniversalObjectCRUD from './MuteerUniversalObjectCRUD'
import { MemoryRouter, Route } from 'react-router-dom'
import UserContext from './../../App/UserContext'
import allDimensies from './../../constants/dimensies'

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

const setup = (dimension, type) => {
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
            <Route path={path}>
                <UserContext.Provider value={{ user: authUser }}>
                    <MuteerUniversalObjectCRUD
                        dimensieConstants={allDimensies[dimension]}
                    />
                </UserContext.Provider>
            </Route>
        </MemoryRouter>
    )
}

describe('MuteerUniversalObjectCRUD', () => {
    dimensions
        .filter((e, i) => i === 0)
        .forEach((dimension) => {
            it(`Should render for dimension ${dimension}`, async () => {
                act(() => {
                    setup(dimension)
                })
                await waitFor(() => screen.getByText(`Opslaan`))
            })

            it(`User should be able to PATCH an existing ${dimension}`, async () => {
                act(() => {
                    setup(dimension, 'PATCH')
                })
                await waitFor(() => screen.getByText(`Opslaan`))
                fireEvent.click(screen.getByText(`Opslaan`))
            })

            it(`User should be able to POST a new ${dimension}`, async () => {
                window.scroll = jest.fn()

                await act(async () => {
                    setup(dimension, 'POST')
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
