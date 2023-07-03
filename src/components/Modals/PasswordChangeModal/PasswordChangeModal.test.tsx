import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import PasswordChangeModal from './PasswordChangeModal'

describe('PasswordChangeModal', () => {
    const defaultProps = {
        setOpen: vi.fn(),
    }

    const setup = (customProps?: any) => {
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
        fireEvent.change(currentPasswordInput, {
            target: { value: 'current-password' },
        })
        fireEvent.change(newPasswordInput, {
            target: { value: 'oaBmMWCXPV4FtZu.9KTPCwix8DuuW@y' },
        })
        fireEvent.change(newPasswordRepeatInput, {
            target: { value: 'oaBmMWCXPV4FtZu.9KTPCwix8DuuW@y1' },
        })
        fireEvent.click(submitBtn)
        const error = await screen.findByText(
            'Het herhaalde wachtwoord komt niet overeen'
        )
        expect(error).toBeInTheDocument()

        fireEvent.change(newPasswordRepeatInput, { target: { value: 'test' } })
        fireEvent.click(submitBtn)
    })
})
