import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LeafletTinyViewer from './LeafletTinyViewer'

describe('LeafletTinyViewer', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletTinyViewer {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('presentation')
        expect(element).toBeTruthy()
    })
})
