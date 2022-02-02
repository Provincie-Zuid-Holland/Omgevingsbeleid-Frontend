import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import Breadcrumbs from './Breadcrumbs'

describe('Breadcrumbs', () => {
    const defaultProps = {
        paths: [
            { name: 'Home', path: '/' },
            { name: 'Another page', path: '/' },
            {
                name: 'Digitale toegankelijkheid',
                path: '/digi-toegankelijkheid',
            },
        ],
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <Breadcrumbs {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()

        const firstEl = screen.getByText('Home')
        expect(firstEl).toBeTruthy()

        const secondEl = screen.getByText('Another page')
        expect(secondEl).toBeTruthy()

        const thirdEl = screen.getByText('Digitale toegankelijkheid')
        expect(thirdEl).toBeTruthy()
    })
})
