import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import objecten from './../../../../constants/koppelingen'
import { beleidskeuzeMock } from './../../../../mocks/data/crudObjects'
import PopUpBewerkKoppeling from './PopUpBewerkKoppeling'

describe('PopUpBewerkKoppeling', () => {
    const togglePopupMock = jest.fn()
    const voegKoppelingRelatieToeMock = jest.fn()
    const verwijderKoppelingRelatieMock = jest.fn()
    const wijzigKoppelingRelatieMock = jest.fn()

    const bewerkItemMock = {
        item: {
            Koppeling_Omschrijving: 'Original description',
            Object: {
                ID: 370,
                UUID: '0000-0001',
                Begin_Geldigheid: '2020-10-07T00:00:00Z',
                Eind_Geldigheid: '9999-12-31T23:00:00Z',
                Created_By: '0000-0001',
                Created_Date: '2020-10-26T07:17:19.793000Z',
                Modified_By: '0000-0002',
                Modified_Date: '2021-05-25T14:05:12.783000Z',
                Titel: '1. Samen werken aan Zuid-Holland Bewerkt',
                Omschrijving: 'Omschrijving',
                Weblink: null,
            },
        },
        propertyName: 'Ambities',
    }

    const defaultProps = {
        togglePopup: togglePopupMock,
        bewerkItem: bewerkItemMock,
        titelMainObject: 'Titel Main Object',
        type: 'ambities',
        voegKoppelingRelatieToe: voegKoppelingRelatieToeMock,
        wijzigKoppelingRelatie: wijzigKoppelingRelatieMock,
        verwijderKoppelingRelatie: verwijderKoppelingRelatieMock,
        crudObject: beleidskeuzeMock,
        objecten: objecten,
    }

    const setup = customProps => {
        const props = customProps ? customProps : defaultProps

        render(<PopUpBewerkKoppeling {...props} />)
    }

    it('Component renders', () => {
        setup()
        const title = screen.getByText('koppelen')
        expect(title).toBeTruthy()
    })

    it('User can cancel the popup', async () => {
        setup()
        const cancelBtn = screen.getByText('Annuleren')
        fireEvent.click(cancelBtn)
        expect(togglePopupMock).toBeCalledTimes(1)
    })

    it('User delete the connection', () => {
        setup()
        const deleteBtn = screen.getByText('Verwijderen')
        fireEvent.click(deleteBtn)
        expect(verwijderKoppelingRelatieMock).toBeCalledTimes(1)
        expect(verwijderKoppelingRelatieMock.mock.calls[0][0]).toBe(
            bewerkItemMock
        )
    })

    it('User edit the connection', () => {
        setup()
        const textarea = screen.getByRole('textbox')
        fireEvent.change(textarea, { target: { value: 'Edited description' } })
        expect(textarea).toHaveValue('Edited description')

        const editBtn = screen.getByText('Wijzigen')
        fireEvent.click(editBtn)
        expect(wijzigKoppelingRelatieMock).toBeCalledTimes(1)
        expect(wijzigKoppelingRelatieMock.mock.calls[0][1]).toBe(
            'Edited description'
        )
    })
})
