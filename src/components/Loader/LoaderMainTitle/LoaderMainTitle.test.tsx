import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderMainTitle from './LoaderMainTitle'

describe('LoaderMainTitle', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderMainTitle {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
