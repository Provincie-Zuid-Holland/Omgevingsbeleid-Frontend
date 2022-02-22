import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import RevisionOverviewContainerMain from './RevisionOverviewContainerMain'

describe('RevisionOverviewContainerMain', () => {
    const setup = () => {
        render(
            <RevisionOverviewContainerMain>
                <span>Test</span>
            </RevisionOverviewContainerMain>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test')
        expect(element).toBeTruthy()
    })
})
