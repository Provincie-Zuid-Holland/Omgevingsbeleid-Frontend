import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import useLockBodyScroll from './useLockBodyScroll'

const ScrollComponent = ({ modalOpen }) => {
    useLockBodyScroll({ modalOpen: modalOpen })
    return (
        <div>
            <span id="scroll-to-element">Element</span>
        </div>
    )
}

describe('useLockBodyScroll', () => {
    const windowScrollMock = jest.fn()
    window.scroll = windowScrollMock

    it('Locks body when modal is open', () => {
        render(<ScrollComponent modalOpen={true} />)
        const html = screen.getByText('Element').closest('html')
        expect(html).toHaveStyle(`overflow: hidden`)
    })

    it('Does not lock the body when modal is NOT open', () => {
        render(<ScrollComponent modalOpen={false} />)
        const html = screen.getByText('Element').closest('html')
        expect(html).not.toHaveStyle(`overflow: hidden`)
    })
})
