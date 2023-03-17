import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ButtonSubmitFixed from './ButtonSubmitFixed'

describe('ButtonSubmitFixed', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed />
            </MemoryRouter>
        )

        const button = screen.getByText('Opslaan')
        expect(button).toBeTruthy()
    })
})
