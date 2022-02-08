import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import PopUpAnimatedContainer from './PopUpAnimatedContainer'

describe('PopUpAnimatedContainer', () => {
    render(
        <PopUpAnimatedContainer>
            <div>Test div</div>
        </PopUpAnimatedContainer>
    )

    it('Component renders', () => {
        const element = screen.getByText('Test div')
        expect(element).toBeTruthy()
    })
})
