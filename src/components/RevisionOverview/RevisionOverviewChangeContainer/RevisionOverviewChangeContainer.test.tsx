import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthProvider from '@/context/AuthContext'
import beleidskeuzeChangesNew from '@/mocks/data/beleidskeuzeChangesNew'
import beleidskeuzeChangesOld from '@/mocks/data/beleidskeuzeChangesOld'
import beleidskeuzeChangesOriginal from '@/mocks/data/beleidskeuzeChangesOriginal'
import beleidskeuzeChangesRevisions from '@/mocks/data/beleidskeuzeChangesRevisions'

import RevisionOverviewChangeContainer from './RevisionOverviewChangeContainer'

const queryClient = new QueryClient()

describe('RevisionOverviewChangeContainer', () => {
    const defaultProps = {
        oldObject: beleidskeuzeChangesOld,
        changesObject: beleidskeuzeChangesNew,
        originalObject: beleidskeuzeChangesOriginal,
        revisionObjects: beleidskeuzeChangesRevisions,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RevisionOverviewChangeContainer {...props} />
                </AuthProvider>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'Adequaat aanbod openbaar vervoer (In Inspraak Test)'
        )
        expect(element).toBeTruthy()
    })
})
