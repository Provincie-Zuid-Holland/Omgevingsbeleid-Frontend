import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

import { revisionDataObject } from '../../../mocks/data/revisionDataObject'
import { revisionObjects } from '../../../mocks/data/revisionObjects'
import PopUpRevisionContainer from './PopUpRevisionContainer'

describe('PopUpRevisionContainer', () => {
    const defaultProps = {
        dataObject: revisionDataObject,
        revisionObjects: revisionObjects,
        titleSingular: 'Beleidskeuze',
    }

    const path = `/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
    const initialEntries = `/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Routes>
                    <Route
                        path={path}
                        element={
                            <div>
                                <PopUpRevisionContainer {...props} />
                                <span>Element outside</span>
                            </div>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(`3 Revisies`)
        expect(element).toBeTruthy()
    })

    it('User can toggle the popup', async () => {
        setup()
        const element = screen.getByText(`3 Revisies`)
        fireEvent.click(element)
        const title = await screen.findByText('Vergelijk versies')
        expect(title).toBeTruthy()
    })
})
