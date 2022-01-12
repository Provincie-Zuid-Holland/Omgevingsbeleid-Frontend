import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderSmallCircle from './LoaderSmallCircle'

describe('LoaderSmallCircle', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSmallCircle {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
