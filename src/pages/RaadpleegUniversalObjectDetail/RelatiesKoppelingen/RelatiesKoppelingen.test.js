import { render } from '@testing-library/react'
import React from 'react'
import RelatiesKoppelingen from './RelatiesKoppelingen'

describe('RelatiesKoppelingen', () => {
    const defaultProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <RelatiesKoppelingen {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('RelatiesKoppelingen')).toBeTruthy()
    })
})
