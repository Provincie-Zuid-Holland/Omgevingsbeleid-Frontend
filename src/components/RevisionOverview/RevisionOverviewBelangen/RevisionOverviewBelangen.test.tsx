import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import RevisionOverviewBelangen from './RevisionOverviewBelangen'

describe('RevisionOverviewBelangen', () => {
    const defaultProps = {
        label: 'Wettelijke Taken',
        object: {
            ID: 718,
            UUID: '3E32231B-1B79-4100-AA59-316F72FE2985',
            Titel: 'Adequaat aanbod openbaar vervoer (In Inspraak Test)',
            Belangen: { new: [], removed: [], same: [] },
        },
        type: 'Wettelijke Taak & Bevoegdheid',
        containsChanges: true,
        placeholder: 'Er zijn geen wettelijke taken gekoppeld',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewBelangen {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Wettelijke Taken')
        expect(element).toBeTruthy()
    })
})
