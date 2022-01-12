import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import Modal from './Modal'

describe('Modal', () => {
    const closeMock = jest.fn()
    const defaultProps = {
        open: true,
        close: closeMock,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <Modal {...props}>
                <span>Test Modal Text</span>
            </Modal>
        )
    }

    it('Component renders content and can be closed', () => {
        setup()

        const children = screen.getByText('Test Modal Text')
        expect(children).toBeTruthy()

        const closeBtn = screen.getByRole('button')
        expect(closeBtn).toBeTruthy()
        fireEvent.click(closeBtn)
        expect(closeMock).toHaveBeenCalledTimes(1)
    })
})
