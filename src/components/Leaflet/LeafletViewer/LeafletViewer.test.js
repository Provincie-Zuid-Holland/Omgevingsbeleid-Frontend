import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LeafletViewer from './LeafletViewer'

describe('LeafletViewer', () => {
    const defaultProps = {
        gebiedenUUIDS: [
            '86689750-475C-4067-9170-4FD906B83BED',
            '86689746-475C-4067-9170-4FD906B83BED',
        ],
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletViewer {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Map')
        expect(element).toBeTruthy()
    })
})
