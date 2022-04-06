import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import Login from './Login'

describe('Login', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )
        const header = screen.getByRole('heading', {
            name: 'Inloggen',
        })
        expect(header).toBeInTheDocument()
    })
})
