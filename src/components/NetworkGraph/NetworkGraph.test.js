import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraph from './NetworkGraph'

const setGraphIsOpen = () => jest.fn()

const initialize = () => {
    render(
        <MemoryRouter>
            <NetworkGraph
                graphIsOpen={true}
                showBanner={true}
                setGraphIsOpen={setGraphIsOpen}
            />
        </MemoryRouter>
    )
}

describe('NetworkGraph', () => {
    it('should render', () => {
        initialize()
        const title = screen.getByText('Netwerkvisualisatie')
        expect(title).toBeInTheDocument()
    })
})
