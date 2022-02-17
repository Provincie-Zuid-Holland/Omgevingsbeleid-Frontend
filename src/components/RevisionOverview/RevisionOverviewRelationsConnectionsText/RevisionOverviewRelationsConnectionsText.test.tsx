import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

import RevisionOverviewRelationsConnectionsText from './RevisionOverviewRelationsConnectionsText'

describe('RevisionOverviewRelationsConnectionsText', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewRelationsConnectionsText {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('')
        expect(element).toBeTruthy()
    })
})
