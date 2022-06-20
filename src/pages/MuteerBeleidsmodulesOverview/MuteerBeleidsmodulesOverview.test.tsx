import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import MuteerBeleidsmodulesOverview from './MuteerBeleidsmodulesOverview'

describe('MuteerBeleidsmodulesOverview', () => {
    const defaultProps = {}

    const path = `/muteer/beleidsmodules/edit/1`
    const initialEntries = `/muteer/beleidsmodules/edit/1`

    it('should render', () => {
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Routes>
                    <Route
                        path={path}
                        element={
                            <MuteerBeleidsmodulesOverview {...defaultProps} />
                        }
                    />
                </Routes>
            </MemoryRouter>
        )
        const text = screen.getByText('Module')
        expect(text).toBeTruthy()
    })
})
