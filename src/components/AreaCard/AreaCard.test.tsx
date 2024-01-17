import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AreaCard from './AreaCard'

describe('AreaCard', () => {
    const defaultProps = {
        title: 'Test',
        link: '/',
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <AreaCard {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test')
        expect(element).toBeTruthy()
    })
})
