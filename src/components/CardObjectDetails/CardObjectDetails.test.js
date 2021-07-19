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
                />
            </MemoryRouter>
        )

        const title = screen.getByText('Test title')
        expect(title).toBeTruthy()
    })

    it('contains a link', () => {
        render(
            <MemoryRouter>
                <CardObjectDetails
                    object={{ Titel: 'Test title', ID: 1 }}
                    titleSingular={'ambitie'}
                    hoofdOnderdeelSlug={'ambities'}
                />
            </MemoryRouter>
        )

        const link = screen.getByRole('link')
        const href = link.href
        expect(href).toBe(`http://localhost/muteer/ambities/1`)
    })

    it('contains a link with a hash that refers to "mijn beleid"', () => {
        render(
            <MemoryRouter>
                <CardObjectDetails
                    object={{ Titel: 'Test title', ID: 1 }}
                    titleSingular={'ambitie'}
                    hoofdOnderdeelSlug={'ambities'}
                    mijnBeleid={true}
                />
            </MemoryRouter>
        )

        const link = screen.getByRole('link')
        const href = link.href
        expect(href).toBe(`http://localhost/muteer/ambities/1#mijn-beleid`)
    })

    it('contains an index in the ID when mapped', () => {
        render(
            <MemoryRouter>
                {[1, 2, 3].map((item, idx) => (
                    <CardObjectDetails
                        object={{ Titel: 'Test title', ID: 1 }}
                        titleSingular={'ambitie'}
                        hoofdOnderdeelSlug={'ambities'}
                        mijnBeleid={true}
                        index={idx}
                    />
                ))}
            </MemoryRouter>
        )

        const links = screen.getAllByRole('link')
        links.forEach((link, linkIndex) => {
            const elementID = link.id
            expect(elementID).toBe(`object-card-ambitie-${linkIndex}`)
        })
    })
})
