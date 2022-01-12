import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderLeafletLargeViewer from './LoaderLeafletLargeViewer'

describe('LoaderLeafletLargeViewer', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderLeafletLargeViewer {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
