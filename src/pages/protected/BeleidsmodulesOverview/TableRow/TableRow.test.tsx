import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import * as BELEIDSKEUZES from '@/constants/beleidskeuzes'

import TableRow from './TableRow'

describe('TableRow', () => {
    const defaultProps = {
        policy: {
            Object: {
                Titel: 'Policy Title',
                Aanleiding: 'Aanleiding',
                ID: 1,
                UUID: '0000-0001',
                Modified_Date: new Date(),
            },
            Type: 'Beleidskeuze',
        },
    }

    const setup = (customProps?: any) => {
        const props = customProps || defaultProps

        render(
            <MemoryRouter>
                <table>
                    <tbody>
                        <TableRow {...props} />
                    </tbody>
                </table>
            </MemoryRouter>
        )
    }

    it('should render', () => {
        setup()
        expect(screen.queryByText('Policy Title')).toBeTruthy()
    })

    it('should display the correct type', () => {
        setup()
        expect(screen.queryByText('Beleidskeuze')).toBeTruthy()
        expect(screen.queryByText('Maatregel')).toBeFalsy()
    })

    it('should display a link', () => {
        setup()
        const link = screen.queryByText('0000-0001') as HTMLLinkElement

        expect(link).toBeTruthy()
        expect(link.href).toBe(
            `http://localhost/muteer/${BELEIDSKEUZES.SLUG_OVERVIEW}/1`
        )
    })
})
