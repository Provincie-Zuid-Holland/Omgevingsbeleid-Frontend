import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ObjectList from './ObjectList'

describe('ObjectList', () => {
    const defaultProps = {
        objectType: 'beleidsdoelen',
        objectSlug: 'beleidsdoelen',
        data: [
            { title: 'Test', id: '123' },
            { title: 'Test 2', id: '1234' },
        ],
        total: 2,
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <ObjectList {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('De 2 beleidsdoelen')
        expect(element).toBeTruthy()
    })
})
