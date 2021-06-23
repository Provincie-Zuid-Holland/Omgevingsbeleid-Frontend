import { render, screen } from '@testing-library/react'
import React from 'react'
import CardObjectDetailsHalfWidth from './CardObjectDetailsHalfWidth'
import { MemoryRouter } from 'react-router-dom'

describe('CardObjectDetailsHalfWidth', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <CardObjectDetailsHalfWidth
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
