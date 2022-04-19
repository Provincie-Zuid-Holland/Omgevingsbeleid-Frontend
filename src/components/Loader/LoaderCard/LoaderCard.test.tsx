import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import LoaderCard from './LoaderCard'

describe('LoaderCard', () => {
    const defaultProps = {}

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<LoaderCard {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
