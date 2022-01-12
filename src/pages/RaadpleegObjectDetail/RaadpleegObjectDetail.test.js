import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import { MemoryRouter, Route } from 'react-router-dom'

import allDimensies from '../../constants/dimensies'
import { beleidskeuzes } from '../../mocks/data/beleidskeuzes'
import RaadpleegObjectDetail from './RaadpleegObjectDetail'

describe('RaadpleegObjectDetail', () => {
    const mockBeleidskeuze = beleidskeuzes[0]
    const defaultProps = {
        dataModel: allDimensies.BELEIDSKEUZES,
    }

    window.scrollTo = jest.fn()

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        const path = `/detail/beleidskeuzes/:id`
        const initialEntries = `/detail/beleidskeuzes/${mockBeleidskeuze.UUID}`
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <RaadpleegObjectDetail {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup()

        await waitForElementToBeRemoved(() => screen.queryByRole('img'))

        const subTitle = screen.getAllByRole('heading', {
            name: /Beleidskeuze/i,
            level: 3,
        })
        expect(subTitle).toBeTruthy()

        const title = screen.getAllByRole('heading', {
            name: mockBeleidskeuze.Titel,
            level: 1,
        })
        expect(title).toBeTruthy()
    })
})
