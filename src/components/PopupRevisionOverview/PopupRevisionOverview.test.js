import { render } from '@testing-library/react'
import React from 'react'
import PopupRevisionOverview from './PopupRevisionOverview'

describe('PopupRevisionOverview', () => {
    const defaultProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <PopupRevisionOverview {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('PopupRevisionOverview')).toBeTruthy()
    })
})
