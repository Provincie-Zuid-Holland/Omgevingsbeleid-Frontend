import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import UserContext from '@/App/UserContext'
import { beleidskeuzeMock } from '@/mocks/data/crudObjects'

import ViewFieldIngelogdExtraInfo from './ViewFieldIngelogdExtraInfo'

describe('ViewFieldIngelogdExtraInfo', () => {
    const defaultProps = {
        crudObject: beleidskeuzeMock,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: { UUID: '0001' } }}>
                    <ViewFieldIngelogdExtraInfo {...props} />
                </UserContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'Deze informatie zien alleen gebruikers die zijn ingelogd.'
        )
        expect(element).toBeTruthy()
    })

    it('Displays a link to edit when the user is the owner', () => {
        setup({
            crudObject: {
                ...beleidskeuzeMock,
                Created_By: { UUID: '0001' },
            },
        })
        const link = screen.getByText('Openen in beheeromgeving')
        expect(link).toBeTruthy()
    })

    it('Does not display a link to edit when the user is not the owner', () => {
        setup({
            crudObject: {
                ...beleidskeuzeMock,
                Created_By: { UUID: '0002' },
            },
        })
        const link = screen.queryByText('Openen in beheeromgeving')
        expect(link).toBeFalsy()
    })

    it('Does not display a Weblink when there is none on the crudObject', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Weblink, ...rest } = beleidskeuzeMock

        setup({
            crudObject: {
                ...rest,
                Created_By: { UUID: '0002' },
            },
        })
        const link = screen.queryByText('IDMS-koppeling')
        expect(link).toBeFalsy()
    })

    it('Adds custom classes if passed as props', () => {
        setup({
            crudObject: {
                ...beleidskeuzeMock,
                Created_By: { UUID: '0002' },
            },
            className: 'custom-test-class',
        })
        const container = screen
            .queryByText(
                'Deze informatie zien alleen gebruikers die zijn ingelogd.'
            )
            ?.closest('div')
        expect(container).toBeTruthy()
        expect(container).toHaveClass('custom-test-class')
    })
})
