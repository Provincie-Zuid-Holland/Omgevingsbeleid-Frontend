import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import RevisionOverviewText from './RevisionOverviewText'

describe('RevisionOverviewText', () => {
    const defaultProps = {
        textContent: 'Test text',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewText {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test text')
        expect(element).toBeTruthy()
    })
})
