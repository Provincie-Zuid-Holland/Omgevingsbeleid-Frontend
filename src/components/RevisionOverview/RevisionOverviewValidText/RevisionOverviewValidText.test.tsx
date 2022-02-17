import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import beleidskeuzeChangesOld from '@/mocks/data/beleidskeuzeChangesOld'
import beleidskeuzeChangesRevisions from '@/mocks/data/beleidskeuzeChangesRevisions'

import RevisionOverviewValidText from './RevisionOverviewValidText'

describe('RevisionOverviewValidText', () => {
    const defaultProps = {
        object: beleidskeuzeChangesOld,
        revisionObjects: beleidskeuzeChangesRevisions,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewValidText {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'Vigerend vanaf 7 augustus 2020 tot heden'
        )
        expect(element).toBeTruthy()
    })
})
