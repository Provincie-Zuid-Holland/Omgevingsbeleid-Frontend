import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderBeleidsrelatieRegel from './LoaderBeleidsrelatieRegel'

describe('LoaderBeleidsrelatieRegel', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderBeleidsrelatieRegel {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
