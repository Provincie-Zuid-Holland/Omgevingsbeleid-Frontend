import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ButtonBackToPage from './ButtonBackToPage'

describe('ButtonBackToPage', () => {
    it('should render', () => {
        const { queryByText } = render(
            <MemoryRouter>
                <ButtonBackToPage
                    terugNaar="pagina"
                    color="bg-red-500"
                    url="/homepage"
                />
            </MemoryRouter>
        )
        expect(queryByText('Terug naar pagina')).toBeTruthy()
    })
})
