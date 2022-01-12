import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderCardHalfWidth from './LoaderCardHalfWidth'

describe('LoaderCardHalfWidth', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderCardHalfWidth {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })

    it('Contains a margin right when halfWidth is true', () => {
        setup({ mr: true })
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
        expect(element).toHaveClass('mr-6')
    })
})
