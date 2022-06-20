import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import TableLatestEdits from './TableLatestEdits'

describe('TableLatestEdits', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<TableLatestEdits {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Titel')
        expect(element).toBeTruthy()
    })
})
