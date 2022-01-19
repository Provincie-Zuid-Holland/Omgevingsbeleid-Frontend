import { render, screen } from '@testing-library/react'

import Text from './Text'

describe('Text', () => {
    const defaultProps = {
        type: 'quote',
        color: 'text-pzh-blue-dark',
        className: '',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<Text {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByTestId('quote-span')
        expect(element).toBeTruthy()
    })
})
