import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderSaving from './LoaderSaving'

describe('LoaderSaving', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderSaving {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Opslaan...')
        expect(element).toBeTruthy()
    })
})
