import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

import VerordeningSidebar from './VerordeningSidebar'

describe('VerordeningSidebar', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const path = `/detail/verordening`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route
                        path={path}
                        element={
                            <>
                                <div id="top-navigation" />
                                <VerordeningSidebar {...props} />
                            </>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsverordening')
        expect(element).toBeTruthy()
    })
})
