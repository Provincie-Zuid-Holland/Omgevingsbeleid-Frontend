import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ContainerDetailMain from './ContainerDetailMain'

describe('ContainerDetailMain', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <ContainerDetailMain
                    dataObject={{ Titel: 'Title of object' }}
                    titleSingular={'titel'}
                    pageType={'detail'}
                    dataReceived={true}
                />
            </MemoryRouter>
        )

        const title = screen.getByText('Title of object')
        expect(title).toBeTruthy()
    })
})
