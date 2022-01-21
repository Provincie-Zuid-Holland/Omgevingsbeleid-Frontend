import { render } from '@testing-library/react'

import LeafletDrawController from './LeafletDrawController'

describe('LeafletDrawController', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletDrawController {...props} />)
    }

    it('Component renders', () => {
        //TODO Still need to finish writing tests
        //expect(element).toBeTruthy()
    })
})
