import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { AmbitiesRead } from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'
import { AuthContext } from '@/context/AuthContext'
import { ambities } from '@/mocks/data/ambities'

import ObjectDetail from './ObjectDetail'

describe('ObjectDetail', () => {
    const mockAmbitieskeuze = ambities[0]
    const defaultProps = {
        dataModel: allDimensies.AMBITIES,
    }

    window.scrollTo = jest.fn()

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/beleidskeuzes/:id`
        const initialEntries = `/beleidskeuzes/${mockAmbitieskeuze.UUID}`

        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <AuthContext.Provider value={{ user: { UUID: '0001' } } as any}>
                    <Routes>
                        <Route
                            path={path}
                            element={
                                <ObjectDetail
                                    dataEndpoint={jest.fn(() =>
                                        Promise.resolve(
                                            ambities as AmbitiesRead[]
                                        )
                                    )}
                                    dataVersionEndpoint={jest.fn(() =>
                                        Promise.resolve(
                                            ambities[0] as AmbitiesRead
                                        )
                                    )}
                                    {...props}
                                />
                            }
                        />
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup()

        await waitForElementToBeRemoved(() =>
            screen.queryByTestId('loader-content')
        )

        const subTitle = screen.getAllByRole('heading', {
            name: /Ambitie/i,
            level: 3,
        })
        expect(subTitle).toBeTruthy()

        const title = screen.getAllByRole('heading', {
            name: mockAmbitieskeuze.Titel,
            level: 1,
        })
        expect(title).toBeTruthy()
    })
})
