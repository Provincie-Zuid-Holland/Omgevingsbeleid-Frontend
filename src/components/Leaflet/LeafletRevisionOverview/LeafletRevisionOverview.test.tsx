import { render } from '@testing-library/react'

import LeafletRevisionOverview from './LeafletRevisionOverview'

describe('LeafletRevisionOverview', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletRevisionOverview {...props} />)
    }

    it('Component renders', () => {
        //TODO still need to finish writing tests
    })
})
