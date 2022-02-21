import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import beleidskeuzeChangesNew from '@/mocks/data/beleidskeuzeChangesNew'
import beleidskeuzeChangesOriginal from '@/mocks/data/beleidskeuzeChangesOriginal'

import RevisionOverviewWerkingsgebied from './RevisionOverviewWerkingsgebied'

describe('RevisionOverviewWerkingsgebied', () => {
    const defaultProps = {
        originalObject: beleidskeuzeChangesOriginal,
        changesObject: beleidskeuzeChangesNew,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RevisionOverviewWerkingsgebied {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            `Beleidskeuze 'Adequaat aanbod openbaar vervoer (In Inspraak Test)' is gewijzigd van gebied 'Concessie- en contractgebied openbaar vervoer' naar gebied 'Concessie- en contractgebied openbaar vervoer'.`
        )
        expect(element).toBeTruthy()
    })
})
