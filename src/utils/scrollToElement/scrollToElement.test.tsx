import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import scrollToElement from './scrollToElement'

const ScrollComponent = () => (
    <div>
        <span id="scroll-to-element">Element</span>
    </div>
)

describe('scrollToElement', () => {
    const windowScrollMock = jest.fn()
    window.scroll = windowScrollMock

    it('returns undefined if we can not find an element', () => {
        expect(scrollToElement('')).toBeUndefined()
        expect(scrollToElement('id-does-not-exist')).toBeUndefined()
    })

    it('adds classes to the element', () => {
        render(<ScrollComponent />)
        scrollToElement('scroll-to-element')
        const el = screen.getByText('Element')
        expect(el).toHaveClass('transition-regular')
        expect(el).toHaveClass('border-red-500')
    })

    it('removes classes after they have been added to the element', () => {
        jest.useFakeTimers()
        render(<ScrollComponent />)
        scrollToElement('scroll-to-element')
        const el = screen.getByText('Element')
        expect(el).toHaveClass('transition-regular')
        expect(el).toHaveClass('border-red-500')
        jest.runAllTimers()
        expect(el).not.toHaveClass('transition-regular')
        expect(el).not.toHaveClass('border-red-500')
    })

    it('scrolls to element', () => {
        render(<ScrollComponent />)
        scrollToElement('scroll-to-element')
        expect(windowScrollMock).toHaveBeenCalledTimes(1)
        expect(windowScrollMock.mock.calls[0][0]).toStrictEqual({
            top: -170,
            behavior: 'smooth',
        })
    })
})
