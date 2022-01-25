import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ButtonSubmitFixed from './ButtonSubmitFixed'

describe('ButtonSubmitFixed', () => {
    const submitMock = jest.fn()

    it('should render', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed submit={submitMock} />
            </MemoryRouter>
        )

        const button = screen.getByText('Opslaan')
        expect(button).toBeTruthy()
    })

    it('should call the callback onClick', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed submit={submitMock} />
            </MemoryRouter>
        )

        const button = screen.getByText('Opslaan')
        fireEvent.click(button)
        expect(submitMock).toHaveBeenCalledTimes(1)
    })

    it('should call the callback on Enter', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed submit={submitMock} />
            </MemoryRouter>
        )

        const button = screen.getByText('Opslaan')
        fireEvent.keyPress(button, {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
        })
        expect(submitMock).toHaveBeenCalledTimes(1)
    })

    it('should not render if the submit prop is falsy', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed submit={null} />
            </MemoryRouter>
        )

        const button = screen.queryByText('Opslaan')
        expect(button).toBeFalsy()
    })
})
