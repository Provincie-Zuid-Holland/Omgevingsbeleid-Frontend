import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LeafletMap, { LeafletMapProps } from './LeafletMap'

describe('LeafletMap', () => {
    const setup = (props?: LeafletMapProps) => {
        const { container } = render(<LeafletMap {...props} />)

        const searchController = container.querySelector(
            '#leaflet-search > div'
        ) as HTMLDivElement

        const drawController = container.querySelector(
            '.leaflet-draw'
        ) as HTMLDivElement

        const layerController = container.querySelector(
            '.leaflet-layers-control'
        ) as HTMLDivElement

        return { container, searchController, drawController, layerController }
    }

    it('Component renders', () => {
        setup()

        const element = screen.getByText('Leaflet')
        expect(element).toBeTruthy()
    })

    it('Component renders with Search controller', () => {
        const { searchController } = setup({
            controllers: { showSearch: true },
        })

        expect(searchController).toBeTruthy()
    })

    it('Search input appears on click Search controller', () => {
        const { searchController } = setup({
            controllers: { showSearch: true },
        })

        fireEvent.click(searchController)

        const searchInput = screen.getByPlaceholderText(
            'Zoeken op de kaart'
        ) as HTMLInputElement

        expect(searchInput).toBeTruthy()
    })

    it('Component renders with Draw controller', () => {
        const { drawController } = setup({ controllers: { showDraw: true } })

        expect(drawController).toBeTruthy()
    })

    it('Draw marker appears on click Draw controller', () => {
        const { container, drawController } = setup({
            controllers: { showDraw: true },
        })

        fireEvent.click(drawController)

        const marker = container.getElementsByClassName('leaflet-marker-icon')
        expect(marker).toBeTruthy()
    })

    it('Component renders with Layer controller', () => {
        const { layerController } = setup({ controllers: { showLayers: true } })

        expect(layerController).toBeTruthy()
    })

    it('Layer pane appears on click Layer controller', async () => {
        setup({ controllers: { showLayers: true } })

        const toggle = screen.getByTestId('leaflet-layers-control-toggle')
        fireEvent.click(toggle)

        const pane = screen.getByTestId('leaflet-layers-control-pane')
        expect(pane).toBeInTheDocument()
    })
})
