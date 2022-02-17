import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import beleidskeuzeChangesNew from '@/mocks/data/beleidskeuzeChangesNew'
import beleidskeuzeChangesOld from '@/mocks/data/beleidskeuzeChangesOld'
import beleidskeuzeChangesOriginal from '@/mocks/data/beleidskeuzeChangesOriginal'
import beleidskeuzeChangesRevisions from '@/mocks/data/beleidskeuzeChangesRevisions'

import RevisionOverviewChangeContainer from './RevisionOverviewChangeContainer'

describe('RevisionOverviewChangeContainer', () => {
    const defaultProps = {
        oldObject: beleidskeuzeChangesOld,
        changesObject: beleidskeuzeChangesNew,
        originalObject: beleidskeuzeChangesOriginal,
        revisionObjects: beleidskeuzeChangesRevisions,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewChangeContainer {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'Adequaat aanbod openbaar vervoer (In Inspraak Test)'
        )
        expect(element).toBeTruthy()
    })
})
