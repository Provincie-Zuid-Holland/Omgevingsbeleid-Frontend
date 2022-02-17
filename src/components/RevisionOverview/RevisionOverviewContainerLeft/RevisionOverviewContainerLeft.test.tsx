import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import RevisionOverviewContainerLeft from './RevisionOverviewContainerLeft'

describe('RevisionOverviewContainerLeft', () => {
    const setup = () => {
        render(
            <RevisionOverviewContainerLeft>
                <span>Test</span>
            </RevisionOverviewContainerLeft>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test')
        expect(element).toBeTruthy()
    })
})
