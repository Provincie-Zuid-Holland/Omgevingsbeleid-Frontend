import {
    render,
    act,
    waitFor,
    screen,
    waitForElementToBeRemoved,
    fireEvent,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import App from './App'

describe('App', () => {
    const defaultProps = {}

    const setup = (customProps: { [key: string]: any }) => {
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

        const windowScrollMock = jest.fn()
        window.scrollTo = windowScrollMock

        await waitFor(() => {
            expect(screen.getByText('Omgevingsbeleid')).toBeInTheDocument()
        })

        // User can navigate to the verordening page
        const menuBtn = screen.getByText('Menu')
        const logoMenu = screen
            .getByAltText('Provincie Zuid-Holland Logo')
            .closest('a')
        fireEvent.click(menuBtn)

        const verordeningLink = screen.getByText('Verordening')
        fireEvent.click(verordeningLink)
        const verordeningTitle = screen.getByRole('heading', {
            name: 'Verordening',
            level: 3,
        })
        expect(verordeningTitle).toBeInTheDocument()

        fireEvent.click(logoMenu as Element)

        const raadpleegBtn = screen.getByText('Raadplegen')
        fireEvent.click(raadpleegBtn)

        expect(screen.getByText('Omgevingsbeleid')).toBeInTheDocument()

        // User can navigate to a detail page
        fireEvent.click(menuBtn)
        const beleidskeuzesLink = screen.getByText('Beleidskeuzes')
        fireEvent.click(beleidskeuzesLink)

        const beleidskeuzesTitle = screen.getByRole('heading', {
            name: 'Beleidskeuzes',
            level: 1,
        })

        expect(beleidskeuzesTitle).toBeInTheDocument()

        await waitForElementToBeRemoved(() =>
            expect(screen.getByText(`De beleidskeuzes worden geladen`))
        )
        const firstBeleidskeuzeItem = screen.getByText(
            'Bovenregionaal warmtenetwerk'
        )
        expect(firstBeleidskeuzeItem).toBeInTheDocument()

        fireEvent.click(firstBeleidskeuzeItem)

        await waitFor(() => {
            // Get all because we have two <h1> elements (one always hidden)
            screen.getAllByRole('heading', {
                name: 'Bovenregionaal warmtenetwerk',
                level: 1,
            })
        })

        // User can navigate to the login page
        // First we logout
        const bewerkenBtn = screen.getByText('Bewerken')
        fireEvent.click(bewerkenBtn)
        const logoutBtn = screen.getByText('Uitloggen')
        fireEvent.click(logoutBtn)

        // Then we can visit the login page
        const loginBtn = screen.getByText('Inloggen')
        fireEvent.click(loginBtn)
        const loginTitle = screen.getByRole('heading', {
            name: 'Inloggen',
            level: 1,
        })

        expect(loginTitle).toBeInTheDocument()

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

        window.dispatchEvent(
            new CustomEvent('authEvent', {
                detail: { message: 'Authenticated sessie is afgelopen' },
            })
        )
    })
})
