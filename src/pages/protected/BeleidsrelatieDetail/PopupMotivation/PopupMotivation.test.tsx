import { render, screen, fireEvent } from '@testing-library/react'

import PopupMotivation from './PopupMotivation'

describe('PopupMotivation', () => {
    const closeMotivationPopup = jest.fn()

    const defaultProps = {
        motivationPopUp: 'eb80e5bf-048c-4bc0-8dc4-2fb92c7e3533',
        setMotivationPopUp: closeMotivationPopup,
        relatie: {
            UUID: 'eb80e5bf-048c-4bc0-8dc4-2fb92c7e3533',
            Omschrijving: 'Test omschrijving',
        },
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<PopupMotivation {...props} />)
        return { closeMotivationPopup }
    }

    it('should render', () => {
        setup()
        const text = screen.getByText('Motivering')
        expect(text).toBeTruthy()
    })

    it('Should display default message when relatie omschrijving is missing', () => {
        setup({
            relatie: {
                UUID: 'eb80e5bf-048c-4bc0-8dc4-2fb92c7e3533',
                Omschrijving: '',
            },
        })
        const text = screen.getByText('Deze relatie heeft geen motivering')
        expect(text).toBeTruthy()
    })

    it('User can close the popup by clicking on the cross', async () => {
        const { closeMotivationPopup } = setup()
        const element = screen.getByTestId(
            `sluit-popup-beleidsrelatie-motivering`
        )
        fireEvent.click(element)
        expect(closeMotivationPopup).toHaveBeenCalledTimes(1)
    })
})
