import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import SidebarMain from './SidebarMain'

describe('SidebarMain', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <AuthProvider>
                    <SidebarMain {...props} />
                </AuthProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.'
        )
        expect(element).toBeTruthy()
    })
})
