import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import beleidskeuzeChangesNew from '@/mocks/data/beleidskeuzeChangesNew'
import beleidskeuzeChangesOriginal from '@/mocks/data/beleidskeuzeChangesOriginal'

import RevisionOverviewRelationsConnectionsText from './RevisionOverviewRelationsConnectionsText'

describe('RevisionOverviewRelationsConnectionsText', () => {
    const defaultProps = {
        objectChanges: beleidskeuzeChangesNew,
        originalObject: beleidskeuzeChangesOriginal,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewRelationsConnectionsText {...props} />)
    }

    it('Component renders', () => {
        setup()
        const elements = screen.getAllByText(
            '2-1-2 Passend en efficiënt personenvervoer'
        )
        expect(elements).toBeTruthy()
        expect(elements.length).toBe(2)

        const emptyPlaceholders = screen.getAllByText(
            'Er zijn geen beleidsregels gekoppeld'
        )
        expect(emptyPlaceholders).toBeTruthy()
        expect(emptyPlaceholders.length).toBe(2)
    })
})
