import { render } from '@testing-library/react'

import LeafletController from './LeafletController'

describe('LeafletController', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletController {...props} />)
    }

    it('Component renders', () => {
        //TODO still need to finish test
    })
})
