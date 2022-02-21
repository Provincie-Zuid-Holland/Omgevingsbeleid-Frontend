import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldInputContainer from './FormFieldInputContainer'

describe('FormFieldInputContainer', () => {
    it('should render', () => {
        render(
            <FormFieldInputContainer>
                <div>Child</div>
            </FormFieldInputContainer>
        )
        const child = screen.getByText('Child')
        expect(child).toBeTruthy()
    })
})
