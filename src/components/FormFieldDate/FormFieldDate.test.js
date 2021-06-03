import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import FormFieldDate from './FormFieldDate'

describe('FormFieldDate', () => {
    it('should render', () => {
        render(
            <FormFieldDate
                hideToggleUitwerkingstrede={true}
                dataObjectProperty="Begin_Geldigheid"
                fieldLabel="Label"
                pValue="pValue"
                titleSingular="Titel"
                handleChange={() => null}
            />
        )
        const label = screen.getByText('Label')
        expect(label).toBeTruthy()
    })
})
