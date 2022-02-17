import { render } from '@testing-library/react'

import RevisionOverviewBelangen, {
    RevisionOverviewBelangenProps,
} from './RevisionOverviewBelangen'

describe('RevisionOverviewBelangen', () => {
    const defaultProps: RevisionOverviewBelangenProps = {}

    it('should render', () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <RevisionOverviewBelangen {...props} />
        )

        expect(asFragment()).toMatchSnapshot()
        expect(queryByText('RevisionOverviewBelangen')).toBeTruthy()
    })
})
