import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import PopupContainer from './PopupContainer'

const defaultProps = {
    show: true,
}

const setup = customProps => {
    const props = { ...defaultProps, ...customProps }
    render(
        <>
            <PopupContainer {...props}>
                <div>Test div</div>
            </PopupContainer>
            <div>Element outside</div>
        </>
    )
}

it('Component renders', () => {
    setup()
    const element = screen.getByText('Test div')
    expect(element).toBeTruthy()
})

it('User can close the popup by clicking outside', () => {
    document.addEventListener = jest
        .fn()
        .mockImplementationOnce((event, callback) => {
            callback(event)
        })
    setup()
    const elementOutside = screen.getByText('Element outside')
    fireEvent.click(elementOutside)
    expect(document.addEventListener).toHaveBeenCalledTimes(1)
})

it('User can close the popup by pressing escape', () => {
    document.addEventListener = jest
        .fn()
        .mockImplementationOnce((event, callback) => {
            callback(event)
        })
    setup()
    const element = screen.getByText('Test div')
    const elementOutside = screen.getByText('Element outside')
    fireEvent.keyPress(element, {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
    })
    expect(document.addEventListener).toHaveBeenCalledTimes(1)
    expect(elementOutside).toBeTruthy()
})
