import {
    render,
    waitForElementToBeRemoved,
    screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'

import allDimensies from './../../constants/dimensies'
import MuteerUniversalObjectDetailWithStatuses from './MuteerUniversalObjectDetailWithStatuses'

describe('MuteerUniversalObjectDetailWithStatuses', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
    }

    const setup = customProps => {
        const path = `/muteer/beleidskeuzes/:single`
        const initialEntries = `/muteer/beleidskeuzes/728`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <MuteerUniversalObjectDetailWithStatuses {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup()
        await waitForElementToBeRemoved(() => screen.queryByRole('img'))
        const header = screen.getByText('Bovenregionaal warmtenetwerk')
        expect(header).toBeTruthy()
    })
})
