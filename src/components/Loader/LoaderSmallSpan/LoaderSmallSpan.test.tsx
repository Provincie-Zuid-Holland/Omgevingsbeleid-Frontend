import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderSmallSpan from './LoaderSmallSpan'

describe('LoaderSmallSpan', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSmallSpan {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
