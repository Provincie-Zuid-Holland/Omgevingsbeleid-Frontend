import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import RevisionOverviewContainerRight from './RevisionOverviewContainerRight'

describe('RevisionOverviewContainerRight', () => {
    const setup = () => {
        render(
            <RevisionOverviewContainerRight>
                <span>Test</span>
            </RevisionOverviewContainerRight>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test')
        expect(element).toBeTruthy()
    })
})
