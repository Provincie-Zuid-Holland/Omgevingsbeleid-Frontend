import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import RevisionOverviewDividerWithTitle from './RevisionOverviewDividerWithTitle'

describe('RevisionOverviewDividerWithTitle', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <RevisionOverviewDividerWithTitle
                title="Test Title"
                singleTitle="true"
                {...props}
            />
        )
    }

    it('Component renders a single title', () => {
        setup()
        const element = screen.getByText('Test Title')
        expect(element).toBeTruthy()
    })

    it('Component renders two titles', () => {
        setup({ singleTitle: false })
        const elements = screen.getAllByText('Test Title')
        expect(elements).toBeTruthy()
        expect(elements.length).toBe(2)
    })
})
