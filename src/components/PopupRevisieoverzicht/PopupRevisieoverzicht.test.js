import { render } from '@testing-library/react'
import React from 'react'
import PopupRevisieoverzicht from './PopupRevisieoverzicht'

describe('PopupRevisieoverzicht', () => {
    const defaultProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <PopupRevisieoverzicht {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('PopupRevisieoverzicht')).toBeTruthy()
    })
})
