import { render, screen } from '@testing-library/react'

import ContainerMapSearch from './ContainerMapSearch'

const createMockMediaMatcher =
    (matches: Record<string, boolean>) => (qs: string) => ({
        matches: matches[qs] ?? false,
        addListener: () => {},
        removeListener: () => {},
    })

describe('ContainerMapSearch', () => {
    beforeEach(() => {
        window.matchMedia = createMockMediaMatcher({
            '(min-width: 500px)': true,
            '(min-width: 1000px)': false,
        }) as any
    })

    it('should render', () => {
        render(
            <ContainerMapSearch>
                <div>Test div</div>
            </ContainerMapSearch>
        )
        const element = screen.getByText('Test div')
        expect(element).toBeTruthy()
    })
})
