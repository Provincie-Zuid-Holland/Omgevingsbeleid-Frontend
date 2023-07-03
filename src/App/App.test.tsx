import { render, act, waitFor, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'

import App from './App'

describe('App', () => {
    const defaultProps = {}

    const setup = (customProps: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <App {...props} />
            </MemoryRouter>
        )
    }

    it('User can navigate through the application', async () => {
        act(() => {
            setup({})
        })

        const windowScrollMock = vi.fn()
        window.scrollTo = windowScrollMock

        await waitFor(() => {
            expect(screen.getByText('Omgevingsbeleid')).toBeInTheDocument()
        })

        // User can navigate to the verordening page
        const menuBtn = screen.getByText('Menu')
        const logoMenu = screen
            .getByAltText('Provincie Zuid-Holland Logo')
            .closest('a')

        // User can navigate to a detail page
        fireEvent.click(menuBtn)
        const beleidskeuzesLink = screen.getByText('Beleidskeuzes')
        fireEvent.click(beleidskeuzesLink)

        const beleidskeuzesTitle = screen.getByRole('heading', {
            name: 'Beleidskeuzes',
            level: 1,
        })

        expect(beleidskeuzesTitle).toBeInTheDocument()

        // User can navigate to the policy changes page
        fireEvent.click(menuBtn)
        const beleidswijzigingenLink = screen.getByText('Beleidswijzigingen')
        fireEvent.click(beleidswijzigingenLink)
        const beleidswijzigingenTitle = screen.getByRole('heading', {
            name: 'In bewerking',
            level: 1,
        })
        expect(beleidswijzigingenTitle).toBeInTheDocument()

        // User can navigate to the releases page
        fireEvent.click(logoMenu as Element)

        const releasesLink = screen.getByText('Bekijk alle releases & planning')
        fireEvent.click(releasesLink)
        const releasesTitle = screen.getByRole('heading', {
            name: 'Planning & Releases',
            level: 1,
        })
        expect(releasesTitle).toBeInTheDocument()

        // User can navigate to the 'a11y' page
        const a11yLink = screen.getByText('Toegankelijkheidsverklaring')
        fireEvent.click(a11yLink)
        const a11yTitle = screen.getByRole('heading', {
            name: 'Toegankelijkheids­verklaring',
            level: 1,
        })
        expect(a11yTitle).toBeInTheDocument()
    })
})
