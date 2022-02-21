import { render, screen } from '@testing-library/react'

import ContainerFormSection from './ContainerFormSection'

describe('ContainerFormSection', () => {
    it('should render', () => {
        render(
            <ContainerFormSection
                beschrijving={'description'}
                titel={'title'}
            />
        )

        const title = screen.getByText('title')
        expect(title).toBeTruthy()

        const description = screen.getByText('description')
        expect(description).toBeTruthy()
    })
})
