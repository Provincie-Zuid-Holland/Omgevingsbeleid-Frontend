import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderIndicator from './LoaderIndicator'

describe('LoaderIndicator', () => {
    const defaultProps = {
        text: 'Opslaan...',
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderIndicator {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Opslaan...')
        expect(element).toBeTruthy()
    })
})
