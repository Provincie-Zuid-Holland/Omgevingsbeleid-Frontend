import { render, screen } from '@testing-library/react'

import Container from './Container'

describe('Container', () => {
    it('should render', () => {
        render(
            <Container>
                <div>Test div</div>
            </Container>
        )
        const element = screen.getByText('Test div')
        expect(element).toBeTruthy()
    })
})
