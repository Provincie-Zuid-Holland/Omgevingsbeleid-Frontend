import { render, screen } from '@testing-library/react'
import React from 'react'
import ButtonSubmitFixed from './ButtonSubmitFixed'
import { MemoryRouter } from 'react-router-dom'

describe('ButtonSubmitFixed', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <ButtonSubmitFixed
                    terugNaar="pagina"
                    color="bg-red-500"
                    url="/homepage"
                />
            </MemoryRouter>
        )

        const button = screen.getByText('Opslaan')
        expect(button).toBeTruthy()
    })
})
