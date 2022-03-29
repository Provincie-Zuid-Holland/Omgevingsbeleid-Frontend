import { render } from '@testing-library/react'

import allDimensies from '@/constants/dimensies'

import MutatePolicyPage, { MutatePolicyPageProps } from './MutatePolicyPage'

describe('MutatePolicyPage', () => {
    const defaultProps: MutatePolicyPageProps = {
        authUser: undefined,
        dimensieConstants: allDimensies.BELEIDSKEUZES,
    }

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <MutatePolicyPage {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('MutatePolicyPage')).toBeTruthy()
    })
})
