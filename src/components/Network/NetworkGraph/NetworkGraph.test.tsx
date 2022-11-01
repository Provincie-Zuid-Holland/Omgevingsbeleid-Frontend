import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraph from './NetworkGraph'

const queryClient = new QueryClient()

const initialize = async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <NetworkGraph />
            </MemoryRouter>
        </QueryClientProvider>
    )

    /** Wait for the nodes and links to render (fixes 'act()' warning) */
    await screen.findByTestId('0000-0001')
    await screen.findByTestId('0000-0002')
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('NetworkGraph', () => {
    it('should render', async () => {
        await initialize()

        const title = screen.getByText('Netwerkvisualisatie')
        expect(title).toBeInTheDocument()
    })

    // it("should render nodes", async () => {
    //     const graphIsOpen = true
    //     initialize(graphIsOpen)

    //     const firstNode = await waitFor(() => screen.findByTestId("0000-0001"))
    //     const secondNode = await screen.findByTestId("0000-0002")

    //     expect(firstNode).toBeInTheDocument()
    //     expect(secondNode).toBeInTheDocument()
    // })

    // it("should show elements when user clicks on a node", async () => {
    //     await initialize()

    //     const firstNode = screen.queryByTestId("0000-0001")

    //     fireEvent.click(firstNode)

    //     const tooltipType = screen.queryByText("Beleidsdoelen")
    //     expect(tooltipType).toBeInTheDocument()

    //     const tooltipTitle = screen.queryByText("Test node 1")
    //     expect(tooltipTitle).toBeInTheDocument()

    //     const tooltipCTA = screen.queryByText("Bekijk het beleidsdoel")
    //     expect(tooltipCTA).toBeInTheDocument()
    // })

    // it("should be able to reset the clickedNode state", async () => {
    //     await initialize()

    //     const firstNode = screen.queryByTestId("0000-0001")

    //     fireEvent.click(firstNode)

    //     const resetBtn = screen.getByTestId("button-reset-nodes")
    //     expect(resetBtn).toBeInTheDocument()

    //     fireEvent.click(resetBtn)

    //     const tooltipTitle = screen.queryByText("Test node 1")
    //     expect(tooltipTitle).not.toBeInTheDocument()
    // })
})
