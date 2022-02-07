import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Heading from './Heading'

describe('Heading', () => {
    const defaultProps = {
        type: 'Test Type',
        titel: 'Test Title',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<Heading {...props} />)
    }

    it('Component renders and displays Type', () => {
        setup()
        const element = screen.getByText(defaultProps.type)
        expect(element).toBeTruthy()
    })

    it('Component renders and displays Title', () => {
        setup()
        const element = screen.getByText(defaultProps.titel)
        expect(element).toBeTruthy()
    })
})
