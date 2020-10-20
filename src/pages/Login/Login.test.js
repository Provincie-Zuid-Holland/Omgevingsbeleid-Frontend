import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import Login from './Login'

const mockSetLoginUser = () => jest.fn()
const mockSetLoginState = () => jest.fn()

describe('Login', () => {
    it('should render', () => {
        const { getByTestId } = render(
            <Login
                setLoginUser={mockSetLoginUser}
                setLoginState={mockSetLoginState}
            />
        )
        expect(getByTestId('form-field-login-submit')).toBeInTheDocument()
    })
})
