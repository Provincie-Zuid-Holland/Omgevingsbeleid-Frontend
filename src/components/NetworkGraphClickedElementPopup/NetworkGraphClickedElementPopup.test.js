import { render } from '@testing-library/react'
import React from 'react'
import NetworkGraphClickedElementPopup from './NetworkGraphClickedElementPopup'

describe('NetworkGraphClickedElementPopup', () => {
    const defaultProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <NetworkGraphClickedElementPopup {...props} />
        )
        expect(queryByText('NetworkGraphClickedElementPopup')).toBeTruthy()
    })
})
