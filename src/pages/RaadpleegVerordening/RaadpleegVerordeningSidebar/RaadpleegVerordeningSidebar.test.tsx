import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

import RaadpleegVerordeningSidebar from './RaadpleegVerordeningSidebar'

describe('RaadpleegVerordeningSidebar', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const path = `/detail/verordening`
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[path]}>
                <Route path={path}>
                    <div id="top-navigation" />
                    <RaadpleegVerordeningSidebar {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsverordening')
        expect(element).toBeTruthy()
    })
})
