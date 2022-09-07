import {
    render,
    waitForElementToBeRemoved,
    fireEvent,
    screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import objecten from '@/constants/koppelingen'
import { beleidskeuzeMock } from '@/mocks/data/crudObjects'

import PopupNieuweKoppeling, { getTypeText } from './PopupNieuweKoppeling'

describe('PopupNieuweKoppeling', () => {
    const types = [
        'belangen',
        'taken',
        'ambities',
        'beleidsdoelen',
        'themas',
        'beleidsregels',
        'beleidsprestaties',
        'maatregelen',
        'verordening',
    ] as (keyof typeof objecten)[]
    const togglePopupMock = jest.fn()
    const voegKoppelingRelatieToeMock = jest.fn()

    const defaultProps = {
        togglePopup: togglePopupMock,
        titelMainObject: 'Titel Main Object',
        type: 'belangen' as keyof typeof objecten,
        voegKoppelingRelatieToe: voegKoppelingRelatieToeMock,
        crudObject: beleidskeuzeMock,
    }

    const setup = (customProps = {}) => {
        const props = { ...defaultProps, ...customProps }
        render(<PopupNieuweKoppeling {...props} />)
    }

    it('Component renders', () => {
        setup()
        const title = screen.getByText('Nationaal Belang koppelen')
        expect(title).toBeTruthy()
    })

    it('User can cancel the popup', async () => {
        setup()
        const cancelBtn = screen.getByText('Annuleren')
        fireEvent.click(cancelBtn)
        expect(togglePopupMock).toBeCalledTimes(1)
    })

    it('User can filter the results', async () => {
        setup()
        await waitForElementToBeRemoved(() =>
            screen.queryByText('Nationale Belangen laden...')
        )

        /** The API Mock of /belang return 3 results */
        expect(screen.getAllByRole('listitem').length).toBe(1)

        /** Filter */
        const searchInput = screen.getByRole('textbox')
        fireEvent.change(searchInput, {
            target: { value: 'Test ambitie woensdag 3 februari 2021' },
        })
        expect(screen.getAllByRole('listitem').length).toBe(1)
    })

    it('The next step button is disabled when no object is selected', () => {
        setup()
        const nextButton = screen.getByText('Volgende')
        expect(nextButton).toHaveClass('cursor-not-allowed')
        expect(nextButton).toHaveClass('opacity-50')
    })

    it('The next step button should not be disabled when an object is selected', async () => {
        setup()
        await waitForElementToBeRemoved(() =>
            screen.queryByText('Nationale Belangen laden...')
        )

        const listItem = screen.getByText(
            'Test ambitie woensdag 3 februari 2021'
        )

        fireEvent.click(listItem)
        const nextButton = screen.getByText('Volgende')
        expect(nextButton).not.toHaveClass('cursor-not-allowed')
        expect(nextButton).not.toHaveClass('opacity-50')
    })

    types.forEach(type => {
        it(`Displays the correct type for ${type} in the text`, () => {
            setup({ type: type })
            const typeText = getTypeText(type)
            expect(
                screen.getByText(
                    `Zoek en selecteer ${typeText} welke je wilt koppelen met de beleidskeuze '${defaultProps.titelMainObject}'`,
                    { exact: false }
                )
            ).toBeTruthy()
        })
    })

    it('User can create a new connection', async () => {
        setup()

        await waitForElementToBeRemoved(() =>
            screen.queryByText('Nationale Belangen laden...')
        )

        // Select item
        const listItem = screen.getByText(
            'Test ambitie woensdag 3 februari 2021'
        )
        fireEvent.click(listItem)

        // Go to the next page
        const nextButton = screen.getByText('Volgende')
        expect(nextButton).not.toHaveClass('opacity-50')
        fireEvent.click(nextButton)

        // Assert we are on the new page
        expect(
            screen.getByText('Beschrijf zo concreet mogelijk de relatie')
        ).toBeTruthy()

        // Assert user can't make a connection without filling in a description
        const connectButton = screen.getByText('Koppelen')
        expect(connectButton).toHaveClass('opacity-50')
        expect(connectButton).toHaveClass('cursor-not-allowed')
        fireEvent.click(connectButton)
        expect(voegKoppelingRelatieToeMock).not.toHaveBeenCalled()

        // Fill in a description
        const descriptionTextArea = screen.getByRole('textbox', {
            name: 'beschrijving',
        })
        expect(descriptionTextArea).toBeTruthy()
        fireEvent.change(descriptionTextArea, {
            target: { value: 'Omschrijving' },
        })
        expect(descriptionTextArea).toHaveValue('Omschrijving')

        // Connect
        fireEvent.click(connectButton)
        expect(voegKoppelingRelatieToeMock).toHaveBeenCalledTimes(1)
        expect(togglePopupMock).toHaveBeenCalledTimes(1)
    })
})
