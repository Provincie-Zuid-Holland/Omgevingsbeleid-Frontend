import {
    render,
    waitForElementToBeRemoved,
    screen,
    fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import PasswordChangeModal from './PasswordChangeModal'

describe('PasswordChangeModal', () => {
    const defaultProps = {
        setOpen: jest.fn(),
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<PasswordChangeModal {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Wachtwoord wijzigen')
        expect(element).toBeTruthy()
    })

    it('User can change their password', async () => {
        setup()

        const currentPasswordInput = screen.getByPlaceholderText(
            'Voer hier je huidig wachtwoord in'
        )
        const newPasswordInput = screen.getByPlaceholderText(
            'Geef hier het nieuwe wachtwoord op'
        )
        const newPasswordRepeatInput = screen.getByPlaceholderText(
            'Herhaal het nieuwe wachtwoord'
        )
        const submitBtn = screen.getByText('Wijzig')

        // Check if fields are required
        expect(currentPasswordInput).toBeRequired()
        expect(newPasswordInput).toBeRequired()
        expect(newPasswordRepeatInput).toBeRequired()

        // Check if user gets an error when the new passwords don't match
        fireEvent.change(newPasswordInput, { target: { value: 'test' } })
        fireEvent.change(newPasswordRepeatInput, { target: { value: 'test2' } })
        fireEvent.click(submitBtn)
        expect(
            screen.getByText('Het herhaalde wachtwoord komt niet overeen')
        ).toBeTruthy()

        fireEvent.change(newPasswordRepeatInput, { target: { value: 'test' } })
        fireEvent.click(submitBtn)

        await waitForElementToBeRemoved(() =>
            screen.queryByText('Het herhaalde wachtwoord komt niet overeen')
        )
    })
})
