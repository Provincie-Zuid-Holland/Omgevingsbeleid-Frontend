import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import useCloseWithEscapeKey from './useCloseWithEscapeKey'

const setup = () => {
    const callbackMock = jest.fn()
    render(<TestComponent callbackMock={callbackMock} />)
    return { callbackMock }
}

const TestComponent = ({ callbackMock }) => {
    const ref = React.useRef(null)
    useCloseWithEscapeKey(ref, callbackMock)
    return (
        <div ref={ref}>
            <span id="scroll-to-element">Element</span>
        </div>
    )
}

describe('useCloseWithEscapeKey', () => {
    it('Calls the callback when the user presses escape', () => {
        const { callbackMock } = setup()
        const el = screen.getByText('Element')
        fireEvent.keyDown(el, { key: 'Escape', code: 'Escape' })
        expect(callbackMock).toHaveBeenCalledTimes(1)
    })

    it('Does not call the callback when the user presses a different key', () => {
        const { callbackMock } = setup()
        const el = screen.getByText('Element')
        fireEvent.keyDown(el, { key: 'Enter', code: 'Enter' })
        expect(callbackMock).toHaveBeenCalledTimes(0)
    })
})
