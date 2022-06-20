import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import BeleidsmodulesOverview from './BeleidsmodulesOverview'

describe('BeleidsmodulesOverview', () => {
    const defaultProps = {}

    const path = `/muteer/beleidsmodules/edit/1`
    const initialEntries = `/muteer/beleidsmodules/edit/1`

    it('should render', () => {
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Routes>
                    <Route
                        path={path}
                        element={<BeleidsmodulesOverview {...defaultProps} />}
                    />
                </Routes>
            </MemoryRouter>
        )
        const text = screen.getByText('Module')
        expect(text).toBeTruthy()
    })
})
