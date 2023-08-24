import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import ObjectList from './ObjectList'

describe('ObjectList', () => {
    const defaultProps = {
        objectType: 'beleidsdoelen',
        objectSlug: 'beleidsdoelen',
        data: [
            { Title: 'Test', UUID: '123' },
            { Title: 'Test 2', UUID: '1234' },
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
