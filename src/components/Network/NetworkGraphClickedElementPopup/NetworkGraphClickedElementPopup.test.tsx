import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraphClickedElementPopup from './NetworkGraphClickedElementPopup'

const setup = (clickedNode?: any) => {
    const resetNodesMock = jest.fn()
    const defaultProps = {
        clickedNode:
            clickedNode !== undefined
                ? clickedNode
                : {
                      Titel: 'Test title',
                      Type: 'beleidskeuzes',
                      UUID: '0000-0000',
                  },
        resetNodes: resetNodesMock,
    }

    render(
        <MemoryRouter>
            <NetworkGraphClickedElementPopup {...defaultProps} />
        </MemoryRouter>
    )

    return { resetNodesMock }
}

describe('NetworkGraphClickedElementPopup', () => {
    it('should render', () => {
        setup()
        const tooltip = screen.queryByRole('tooltip')
        expect(tooltip).toBeTruthy()
    })

    it('should not display the tooltip when there is no clickedNode', () => {
        const defaultClickedNode = null
        setup(defaultClickedNode)
        const tooltip = screen.queryByRole('tooltip')
        expect(tooltip).toBeFalsy()
    })

    it('should display the CTA text in the popup', () => {
        setup()
        expect(screen.getByText('Bekijk de Beleidskeuze')).toBeTruthy()
    })

    it('should display the title of the clickedNode in the popup', () => {
        setup()
        expect(screen.getByText('Test title')).toBeTruthy()
    })

    it('should display the type of the clickedNode in the popup', () => {
        setup()
        expect(screen.getByText('Bekijk de Beleidskeuze')).toBeTruthy()
    })

    it('should contain a link to go to the detail page of the object', () => {
        setup()
        expect(screen.queryByRole('link')).toHaveAttribute(
            'href',
            '/beleidskeuzes/0000-0000'
        )
    })

    it('should close the popup when user clicks on the close button', async () => {
        const { resetNodesMock } = setup()
        const closeBtn = screen.queryByRole('button') as HTMLButtonElement

        fireEvent.click(closeBtn)

        expect(resetNodesMock).toBeCalledTimes(1)
        expect(screen.queryByText('Beleidskeuze')).not.toBeTruthy()
    })

    it('should close the popup when user focusses the close button and presses the enter key', async () => {
        const { resetNodesMock } = setup()
        const closeBtn = screen.queryByRole('button') as HTMLButtonElement

        fireEvent.keyPress(closeBtn, {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
        })

        expect(resetNodesMock).toBeCalledTimes(1)
        expect(screen.queryByText('Beleidskeuze')).not.toBeTruthy()
    })
})
