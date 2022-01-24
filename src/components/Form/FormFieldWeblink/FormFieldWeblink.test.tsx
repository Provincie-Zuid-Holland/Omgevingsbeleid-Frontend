import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldWeblink from './FormFieldWeblink'

describe('FormFieldWeblink', () => {
    const handleChangeMock = jest.fn()
    const defaultValue = 'https://google.com'
    const defaultProps = {
        handleChange: handleChangeMock,
        fieldValue: defaultValue,
        dataObjectProperty: 'Weblink',
        fieldLabel: 'IDMS',
        pValue: 'Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren).',
        titleSingular: 'titleSingular',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldWeblink {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('IDMS')
        expect(element).toBeTruthy()
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue(defaultValue)
    })

    it('Component renders with null value', () => {
        setup({ fieldValue: null })
        const element = screen.getByText('IDMS')
        expect(element).toBeTruthy()
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('')
    })

    it('Typing calls change handler', () => {
        setup()
        const element = screen.getByText('IDMS')
        expect(element).toBeTruthy()
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue(defaultValue)
        fireEvent.change(input, { target: { value: 'New Value' } })
        expect(handleChangeMock).toHaveBeenCalledTimes(1)
    })
})
