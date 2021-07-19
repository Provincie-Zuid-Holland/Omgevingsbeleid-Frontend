import { render, screen } from '@testing-library/react'
import React from 'react'
import ModuleAmount from './ModuleAmount'

describe('ModuleAmount', () => {
    const defaultProps = {
        currentBeleidsmodule: { Titel: 'Titel' },
        policies: ['1', '2'],
    }

    it('should render', () => {
        render(<ModuleAmount {...defaultProps} />)
        const text = screen.getByText("In de module 'Titel' zitten")
        expect(text).toBeTruthy()
    })

    it('should display the correct text amount for multiple policies', () => {
        render(<ModuleAmount {...defaultProps} />)
        const amountText = screen.getByText('2 beleidsstukken')
        expect(amountText).toBeTruthy()
    })

    it('should display the correct text for one policy', () => {
        render(<ModuleAmount {...defaultProps} policies={['1']} />)
        const titleText = screen.getByText("In de module 'Titel' zit")
        const amountText = screen.getByText('1 beleidsstuk')
        expect(amountText).toBeTruthy()
        expect(titleText).toBeTruthy()
    })

    it('should display the correct text for 2 or more policies', () => {
        render(<ModuleAmount {...defaultProps} policies={['1', '2']} />)
        const titleText = screen.getByText("In de module 'Titel' zitten")
        const amountText = screen.getByText('2 beleidsstukken')
        expect(amountText).toBeTruthy()
        expect(titleText).toBeTruthy()
    })

    it('should not render if policies is Falsy', () => {
        render(<ModuleAmount {...defaultProps} policies={null} />)
        const amountText = screen.queryByText('2 beleidsstukken')
        expect(amountText).toBeFalsy()
    })

    it('should not render if currentBeleidsmodule is Falsy', () => {
        render(<ModuleAmount {...defaultProps} currentBeleidsmodule={null} />)
        const amountText = screen.queryByText('2 beleidsstukken')
        expect(amountText).toBeFalsy()
    })
})