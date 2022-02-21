import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderSelect from './LoaderSelect'

describe('LoaderSelect', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSelect {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
