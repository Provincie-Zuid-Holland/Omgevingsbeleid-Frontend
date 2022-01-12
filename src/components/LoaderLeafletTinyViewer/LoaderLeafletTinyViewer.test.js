import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderLeafletTinyViewer from './LoaderLeafletTinyViewer'

describe('LoaderLeafletTinyViewer', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderLeafletTinyViewer {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
