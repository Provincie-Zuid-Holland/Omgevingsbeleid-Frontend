import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContentTekst from './ContentTekst'

describe('ContentTekst', () => {
    const defaultProps = {
        titel: 'Test titel',
        content: 'Test content',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContentTekst {...props} />)
    }

    it('Component renders and displays Titel', () => {
        setup()
        const element = screen.getByText(defaultProps.titel)
        expect(element).toBeTruthy()
    })

    it('Component renders and displays Content', () => {
        setup()
        const element = screen.getByText(defaultProps.content)
        expect(element).toBeTruthy()
    })
})
