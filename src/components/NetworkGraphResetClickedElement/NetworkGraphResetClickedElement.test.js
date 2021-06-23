import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import NetworkGraphResetClickedElement from './NetworkGraphResetClickedElement'

describe('NetworkGraphResetClickedElement', () => {
    const setup = () => {
        const resetNodes = jest.fn()
        const defaultProps = {
            clickedNode: {},
            resetNodes: resetNodes,
        }
        render(<NetworkGraphResetClickedElement {...defaultProps} />)
        const resetButton = screen.getByRole('button')
        return { resetNodes, resetButton }
    }

    it('should render', () => {
        const { resetButton } = setup()
        expect(resetButton).toBeTruthy()
    })

    it('should reset nodes on click', () => {
        const { resetNodes, resetButton } = setup()
        fireEvent.click(resetButton)
        expect(resetNodes).toBeCalledTimes(1)
    })

    it('should not show when there is no clickedNode', () => {
        render(<NetworkGraphResetClickedElement clickedNode={null} />)
        expect(screen.queryByRole('button')).toBe(null)
    })

    it('should show when there is a clickedNode', () => {
        render(<NetworkGraphResetClickedElement clickedNode={{}} />)
        expect(screen.getByRole('button')).toBeTruthy()
    })
})
