import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import useClickOutsideContainer from './useClickOutsideContainer'

const setup = () => {
    const callbackMock = jest.fn()
    render(<TestComponent callbackMock={callbackMock} />)
    return { callbackMock }
}

const TestComponent = ({ callbackMock }) => {
    const reference = React.useRef(null)
    useClickOutsideContainer(reference, callbackMock)
    return (
        <div>
            <span>outside</span>
            <div ref={reference}>
                <span>inside</span>
            </div>
        </div>
    )
}

describe('useClickOutsideContainer', () => {
    it('Does not call the callback when the user clicks inside', () => {
        const { callbackMock } = setup()
        const elInside = screen.getByText('inside')
        fireEvent.mouseDown(elInside, { target: elInside })
        expect(callbackMock).toHaveBeenCalledTimes(0)
    })

    it('Call the callback when user clicks outside', () => {
        const { callbackMock } = setup()
        const elOutside = screen.getByText('outside')
        fireEvent.mouseDown(elOutside, { target: elOutside })
        expect(callbackMock).toHaveBeenCalledTimes(1)
    })
})
