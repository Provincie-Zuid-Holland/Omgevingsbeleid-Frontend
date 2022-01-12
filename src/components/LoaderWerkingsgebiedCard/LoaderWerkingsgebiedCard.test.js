import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderWerkingsgebiedCard from './LoaderWerkingsgebiedCard'

describe('LoaderWerkingsgebiedCard', () => {
    const defaultProps = {}

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderWerkingsgebiedCard {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
