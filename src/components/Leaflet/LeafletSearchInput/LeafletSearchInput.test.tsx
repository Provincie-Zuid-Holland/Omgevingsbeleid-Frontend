import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { BrowserRouter } from 'react-router-dom'

import LeafletSearchInput from './LeafletSearchInput'

describe('LeafletSearchInput', () => {
    const selectMock = vi.fn()
    const mapPanToMock = vi.fn()
    const defaultProps = {
        mapPanTo: mapPanToMock,
        reference: {
            current: {
                select: selectMock,
            },
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <BrowserRouter>
                <LeafletSearchInput {...props} />
            </BrowserRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByTestId('leaflet-search')
        expect(element).toBeTruthy()
    })
})
