import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import TableHeading from './TableHeading'

describe('TableHeading', () => {
    const setSortingMock = jest.fn()
    const defaultProps = {
        property: 'property',
        sorting: { activeSorting: true },
        setSorting: setSortingMock,
        label: 'Label',
        children: null,
        noIcon: true,
    }

    const setup = (customProps = {}) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <table>
                <thead>
                    <tr>
                        <TableHeading {...props} />
                    </tr>
                </thead>
            </table>
        )
    }

    it('should render', () => {
        setup()
        const tableHeadingLabel = screen.getByText('Label')
        expect(tableHeadingLabel).toBeTruthy()
    })

    it('should show hover styles when there is an icon', () => {
        setup({ noIcon: false })
        const rowHeader = screen.getByRole('columnheader')
        expect(rowHeader).toBeTruthy()
        expect(rowHeader).toHaveClass('cursor-pointer')
        expect(rowHeader).toHaveClass('hover:text-gray-900')
    })

    it('should not show hover styles when there is no icon', () => {
        setup({ noIcon: true })
        const rowHeader = screen.getByRole('columnheader')
        expect(rowHeader).not.toHaveClass('cursor-pointer')
        expect(rowHeader).not.toHaveClass('hover:text-gray-900')
    })

    it('should not fire a onClick if there is no icon', () => {
        setup({ noIcon: true })
        const rowHeader = screen.getByRole('columnheader')
        fireEvent.click(rowHeader)
        expect(setSortingMock).toHaveBeenCalledTimes(0)
    })

    it('should fire a onClick with type "toggle" if there is an icon and the row is active', () => {
        setup({ noIcon: false, sorting: { activeSorting: 'property' } })
        const rowHeader = screen.getByRole('columnheader')
        fireEvent.click(rowHeader)
        expect(setSortingMock).toHaveBeenCalledTimes(1)
        expect(setSortingMock.mock.calls[0][0]).toStrictEqual({
            property: 'property',
            type: 'toggle',
        })
    })

    it('should fire a onClick with type "reactivate" if there is an icon and the row is not active', () => {
        setup({
            noIcon: false,
            sorting: { activeSorting: 'different property' },
        })
        const rowHeader = screen.getByRole('columnheader')
        fireEvent.click(rowHeader)
        expect(setSortingMock).toHaveBeenCalledTimes(1)
        expect(setSortingMock.mock.calls[0][0]).toStrictEqual({
            property: 'property',
            type: 'reactivate',
        })
    })
})
