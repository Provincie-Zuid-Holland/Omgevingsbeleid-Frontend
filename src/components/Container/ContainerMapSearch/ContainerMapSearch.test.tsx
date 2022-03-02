import { render, screen } from '@testing-library/react'

import ContainerMapSearch from './ContainerMapSearch'

describe('ContainerMapSearch', () => {
    it('should render', () => {
        render(
            <ContainerMapSearch>
                <div>Test div</div>
            </ContainerMapSearch>
        )
        const element = screen.getByText('Test div')
        expect(element).toBeTruthy()
    })
})
