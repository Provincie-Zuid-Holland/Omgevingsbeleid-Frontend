import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Button from './Button'

describe('Button', () => {
    const defaultProps = {
        text: 'Button text',
    }

    const setup = (customProps?: Record<string, unknown>) => {
        const props = { ...defaultProps, ...customProps }
        render(<Button {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Button text')
        expect(element).toBeTruthy()
    })
})
