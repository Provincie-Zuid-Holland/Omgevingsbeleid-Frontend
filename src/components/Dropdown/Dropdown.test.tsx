import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import Dropdown, { DropdownProps } from './Dropdown'

describe('Dropdown', () => {
    const callback = vi.fn()
    const slug = '/this-is-a-slug/for-testing'

    const defaultProps: DropdownProps = {
        isOpen: true,
        setIsOpen: () => null,
        items: [
            {
                text: 'test1',
                callback: callback,
            },
            {
                text: 'test2',
                link: slug,
            },
        ],
    }

    const setup = () => {
        render(
            <MemoryRouter>
                <Dropdown {...defaultProps} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()

        const firstItem = screen.getByText('test1')
        expect(firstItem).toBeTruthy()

        const secondItem = screen.getByText('test2')
        expect(secondItem).toBeTruthy()

        fireEvent.click(firstItem)
        expect(callback).toBeCalledTimes(1)

        expect(secondItem).toHaveAttribute('href', slug)
    })
})
