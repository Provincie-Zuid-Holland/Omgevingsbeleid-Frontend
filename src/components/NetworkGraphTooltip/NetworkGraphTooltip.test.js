import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

import NetworkGraphTooltip from './NetworkGraphTooltip'

describe('NetworkGraphTooltip', () => {
    const setup = () => {
        const setGraphIsOpenMock = jest.fn()

        const defaultProps = {
            variables: {
                left: 10,
                top: 10,
            },
            setGraphIsOpen: setGraphIsOpenMock,
            href: '/href',
        }

        const props = { ...defaultProps }
        render(
            <MemoryRouter>
                <NetworkGraphTooltip {...props} />
            </MemoryRouter>
        )
        return { setGraphIsOpenMock }
    }

    it('should render', () => {
        setup()
        expect(screen.getByRole('tooltip')).toBeTruthy()
    })

    it('should close when the user clicks on the tooltip', () => {
        const { setGraphIsOpenMock } = setup()
        const tooltip = screen.getByRole('tooltip')
        fireEvent.click(tooltip)
        expect(setGraphIsOpenMock).toBeCalledTimes(1)
    })

    it('should link to the supplied href', () => {
        setup()
        const tooltip = screen.getByRole('tooltip')
        expect(tooltip).toHaveAttribute('href', '/href')
    })
})
