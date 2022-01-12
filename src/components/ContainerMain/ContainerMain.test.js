import { render, screen } from '@testing-library/react'

import ContainerMain from './ContainerMain'

describe('ContainerMain', () => {
    it('should render', () => {
        render(
            <ContainerMain>
                <div>Child Element</div>
            </ContainerMain>
        )

        const child = screen.getByText('Child Element')
        expect(child).toBeTruthy()
    })
})
