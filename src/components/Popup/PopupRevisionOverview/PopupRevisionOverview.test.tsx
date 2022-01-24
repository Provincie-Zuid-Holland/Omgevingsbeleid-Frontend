import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { revisionDataObject } from '@/mocks/data/revisionDataObject'
import { revisionObjects } from '@/mocks/data/revisionObjects'

import PopupRevisionOverview from './PopupRevisionOverview'

describe('PopupRevisionOverview', () => {
    const setRevisionOverviewOpenMock = jest.fn()
    const defaultProps = {
        revisionOverviewOpen: true,
        setRevisionOverviewOpen: setRevisionOverviewOpenMock,
        dataObject: revisionDataObject,
        revisionObjects: revisionObjects,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<PopupRevisionOverview {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Revisieoverzicht')
        expect(element).toBeTruthy()
    })
})
