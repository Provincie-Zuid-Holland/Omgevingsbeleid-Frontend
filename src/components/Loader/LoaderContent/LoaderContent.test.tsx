import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderContent from './LoaderContent'

describe('LoaderContent', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderContent {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByTestId('loader-content')

        expect(element).toBeTruthy()
    })
})
