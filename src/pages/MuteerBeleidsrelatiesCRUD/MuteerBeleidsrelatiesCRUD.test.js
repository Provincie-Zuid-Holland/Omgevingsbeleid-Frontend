import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import allDimensies from './../../constants/dimensies'
import { beleidskeuzes } from './../../mocks/data/beleidskeuzes'
import MuteerBeleidsrelatiesCRUD from './MuteerBeleidsrelatiesCRUD'

// https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
jest.mock('react-select', () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
            option => option.value === event.currentTarget.value
        )
        onChange(option)
    }

    return (
        <select data-testid="select" value={value} onChange={handleChange}>
            {options.map(({ label, value }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    )
})

describe('MuteerBeleidsrelatiesCRUD', () => {
    const defaultProps = {
        dataModel: allDimensies.BELEIDSRELATIES,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter
                initialEntries={[
                    `/muteer/beleidsrelaties/${beleidskeuzes[0].UUID}/nieuwe-relatie`,
                ]}
            >
                <ToastContainer position="bottom-left" />
                <Route path={'/muteer/beleidsrelaties/:UUID/nieuwe-relatie'}>
                    <MuteerBeleidsrelatiesCRUD {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Voeg een nieuwe beleidsrelatie toe')
        expect(element).toBeTruthy()
    })

    it('Gets the Beleidskeuze data from the API and displays it in the UI', async () => {
        setup()
        const title = await screen.findByText(
            `Geef aan met welke beleidskeuze '${beleidskeuzes[0].Titel}' een relatie moet krijgen en motiveer waarom.`
        )
        expect(title).toBeTruthy()
    })

    it('User can fill in the fields', async () => {
        setup()

        const submitBtn = screen.getByText('Opslaan')

        /** Check Toast */
        fireEvent.click(submitBtn)
        expect(
            await screen.findByText('Selecteer een beleidskeuze')
        ).toBeInTheDocument()

        /** Fill in Select */
        const select = await screen.findByRole('combobox')
        expect(select).toBeInTheDocument()

        fireEvent.change(select, {
            target: {
                value: beleidskeuzes[2].UUID,
                name: 'Naar_Beleidskeuze',
            },
        })
        expect(select.value).toBe(beleidskeuzes[2].UUID)

        /** Fill in Description */
        const description = screen.getByRole('textbox')
        fireEvent.change(description, {
            target: {
                value: 'Test omschrijving',
                name: 'Omschrijving',
            },
        })
        expect(description.value).toBe('Test omschrijving')

        /** Check Toast */
        fireEvent.click(submitBtn)
        expect(
            await screen.findByText('Vul een inwerkingtreding datum in')
        ).toBeInTheDocument()

        const startingDate = screen.getByTestId(
            'form-field-beleidsrelatie-begin_geldigheid'
        )
        fireEvent.change(startingDate, { target: { value: '2021-10-10' } })
        expect(startingDate).toHaveValue('2021-10-10')

        fireEvent.click(submitBtn)
        expect(
            await screen.findByText('Vul een uitwerkingtreding datum in')
        ).toBeInTheDocument()

        const EndDate = screen.getByTestId(
            'form-field-beleidsrelatie-eind_geldigheid'
        )
        fireEvent.change(EndDate, { target: { value: '2021-10-10' } })
        expect(EndDate).toHaveValue('2021-10-10')

        fireEvent.click(submitBtn)

        expect(await screen.findByText('Opgeslagen')).toBeInTheDocument()
    })
})
