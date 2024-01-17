import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import PlanningAndReleases from './PlanningAndReleases'

describe('PlanningAndReleases', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <PlanningAndReleases {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Planning & Releases')
        expect(element).toBeTruthy()
    })
})
