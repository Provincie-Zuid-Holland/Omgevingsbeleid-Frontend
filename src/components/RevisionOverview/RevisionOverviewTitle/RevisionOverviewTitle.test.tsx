import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import RevisionOverviewTitle from './RevisionOverviewTitle'

describe('RevisionOverviewTitle', () => {
    const defaultProps = {
        title: 'Test text',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewTitle {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test text')
        expect(element).toBeTruthy()
    })
})
