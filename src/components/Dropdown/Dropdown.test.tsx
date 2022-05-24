import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import Dropdown, { DropdownProps } from './Dropdown'

describe('Dropdown', () => {
    const defaultProps: DropdownProps = {
        isOpen: true,
        setIsOpen: () => null,
        items: [
            {
                text: 'test1',
            },
            {
                text: 'test2',
            },
        ],
    }

    const setup = () => {
        render(<Dropdown {...defaultProps} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('')
        expect(element).toBeTruthy()
    })
})
