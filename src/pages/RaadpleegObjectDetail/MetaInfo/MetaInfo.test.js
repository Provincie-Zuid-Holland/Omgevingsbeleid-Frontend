import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import '@testing-library/jest-dom'

import MetaInfo from './MetaInfo'
import getVigerendText from './../../../utils/getVigerendText'
import { beleidskeuzes } from './../../../mocks/data/beleidskeuzes'

describe('MetaInfo', () => {
    const dataObject = beleidskeuzes[0]
    const defaultProps = {
        titleSingular: 'Beleidskeuze',
        dataLoaded: true,
        revisionObjects: beleidskeuzes,
        dataObject: dataObject,
        currentUUID: '86046B8A-973F-435B-9EF0-5F654A0961C8',
    }

    const path = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
    const initialEntries = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <MetaInfo {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const vigerendText = getVigerendText({ dataObject, prefix: true })
        expect(typeof vigerendText).toBe('string')
        expect(vigerendText.length).toBeGreaterThan(0)
        const element = screen.getByText(vigerendText)
        expect(element).toBeTruthy()
    })
})
