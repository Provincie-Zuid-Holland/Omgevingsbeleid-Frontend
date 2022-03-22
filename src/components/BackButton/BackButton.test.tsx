import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import BackButton from './BackButton'

describe('BackButton', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                {/* <Route path={path}> */}
                <BackButton {...props} />
                {/* </Route> */}
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Terug')
        expect(element).toBeTruthy()
    })
})
