import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraphTooltip from './NetworkGraphTooltip'

describe('NetworkGraphTooltip', () => {
    const setup = () => {
        const defaultProps = {
            variables: {
                left: 10,
                top: 10,
            },
            href: '/href',
        }

        const props = { ...defaultProps }

        render(
            <MemoryRouter>
                <NetworkGraphTooltip {...props} />
            </MemoryRouter>
        )
    }

    it('should render', () => {
        setup()
        expect(screen.getByRole('tooltip')).toBeTruthy()
    })

    it('should link to the supplied href', () => {
        setup()
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveAttribute('href', '/href')
    })
})
