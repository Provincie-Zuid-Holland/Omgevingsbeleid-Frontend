import { render, screen } from '@testing-library/react'
import React from 'react'
import CardObjectDetails from './CardObjectDetails'
import { MemoryRouter } from 'react-router-dom'

describe('CardObjectDetails', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <CardObjectDetails
                    object={{ Titel: 'Test title' }}
                    titleSingular={'ambitie'}
                    hoofdOnderdeelSlug={'ambities'}
                    hideParagraaf={false}
                    index={0}
                />
            </MemoryRouter>
        )

        const title = screen.getByText('Test title')
        expect(title).toBeTruthy()
    })
})
