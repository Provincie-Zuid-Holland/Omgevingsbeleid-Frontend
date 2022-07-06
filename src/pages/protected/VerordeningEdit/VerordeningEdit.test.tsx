import { render } from '@testing-library/react'
import React from 'react'

import VerordeningEdit from './VerordeningEdit'

describe('VerordeningEdit', () => {
    const defaultProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <VerordeningEdit {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('VerordeningEdit')).toBeTruthy()
    })
})
