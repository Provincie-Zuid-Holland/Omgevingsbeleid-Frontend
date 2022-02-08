import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import VOLGENDE_STATUS from './../../../constants/beleidskeuzeStatusAanpassen'

import PopUpStatusAanpassen from './PopUpStatusAanpassen'

describe('PopUpStatusAanpassen', () => {
    const togglePopupMock = jest.fn()

    const defaultProps = {
        toggleStatusPopup: togglePopupMock,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<PopUpStatusAanpassen {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('- selecteer een optie -')
        expect(element).toBeTruthy()
    })

    it('User can change the status', () => {
        //TODO write test to test dropdown of status
    })

    it('User can cancel the popup', async () => {
        setup()
        const cancelBtn = screen.getByText('Annuleren')
        fireEvent.click(cancelBtn)
        expect(togglePopupMock).toBeCalledTimes(1)
    })

    it('The Aanpassen button is disabled when no status is selected', () => {
        setup()
        const aanpassenButton = screen.getByText('Aanpassen')
        expect(aanpassenButton).toHaveClass('cursor-not-allowed')
    })
})
