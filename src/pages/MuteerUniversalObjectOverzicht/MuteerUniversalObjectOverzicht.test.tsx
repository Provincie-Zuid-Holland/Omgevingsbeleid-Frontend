import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import UserContext from '@/App/UserContext'
import allDimensies from '@/constants/dimensies'
import { beleidskeuzes } from '@/mocks/data/beleidskeuzes'

import MuteerUniversalObjectOverzicht from './MuteerUniversalObjectOverzicht'

const authedRoles = [
    'Beheerder',
    'Functioneel beheerder',
    'Technisch beheerder',
    'Test runner',
    'Tester',
]

describe('MuteerUniversalObjectOverzicht', () => {
    const defaultProps = {
        dimensieConstants: allDimensies.BELEIDSKEUZES,
        hideAddObject: false,
    }

    const setup = (customProps?: any, user: any = {}) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={['/']}>
                <UserContext.Provider value={{ ...user }}>
                    <MuteerUniversalObjectOverzicht {...props} />
                </UserContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup({}, { user: { UUID: '0001' } })
        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))
        beleidskeuzes.forEach(beleidskeuze => {
            const beleidskeuzeTitle = screen.getByText(beleidskeuze.Titel)
            expect(beleidskeuzeTitle).toBeTruthy()
        })
        const singularTitleHeadings = screen.getAllByRole('heading', {
            level: 5,
        })
        expect(singularTitleHeadings.length).toBe(3)
    })

    it('Redirects for non-auth users', async () => {
        setup(
            {
                dimensieConstants: allDimensies.BELEIDSMODULES,
            },
            { user: { UUID: '0001' } }
        )

        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

        beleidskeuzes.forEach(beleidskeuze => {
            const beleidskeuzeTitle = screen.queryByText(beleidskeuze.Titel)
            expect(beleidskeuzeTitle).toBeFalsy()
        })

        // Expect to redirect to 'Mijn Beleid' page
        expect(screen.getByText('Mijn beleid')).toBeTruthy()
    })

    authedRoles.forEach(role => {
        it(`Does not redirect for auth users with role ${role}`, async () => {
            const user = { user: { UUID: '0001', Rol: role } }

            setup(
                {
                    dimensieConstants: allDimensies.BELEIDSMODULES,
                },
                user
            )

            await waitForElementToBeRemoved(() => screen.getAllByRole('img'))

            expect(
                screen.getByRole('heading', {
                    level: 2,
                    name: 'Beleidsmodules',
                })
            ).toBeTruthy()
        })
    })
})