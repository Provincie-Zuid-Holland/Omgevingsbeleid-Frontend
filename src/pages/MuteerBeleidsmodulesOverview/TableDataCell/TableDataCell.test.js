import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import TableDataCell from './TableDataCell'

describe('TableDataCell', () => {
    const setup = (className = null) =>
        render(
            <table>
                <tbody>
                    <tr>
                        <TableDataCell className={className}>
                            <div>Test</div>
                        </TableDataCell>
                    </tr>
                </tbody>
            </table>
        )

    it('should render', () => {
        setup()
        expect(screen.getByText('Test')).toBeTruthy()
    })

    it('should display prop classes when passed', () => {
        setup('test-class')
        expect(screen.getByRole('cell')).toHaveClass('test-class')
    })

    it('should not display prop classes if none are passed', () => {
        setup()
        expect(screen.getByRole('cell')).not.toHaveClass('test-class')
    })
})
