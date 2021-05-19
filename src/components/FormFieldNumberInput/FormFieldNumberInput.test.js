import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import FormFieldNumberInput from './FormFieldNumberInput'

describe('FormFieldNumberInput', () => {
    it('should render', () => {
        render(
            <FormFieldNumberInput
                dataObjectProperty={'numberProperty'}
                pValue={'Description'}
                titleSingular={'Singular'}
                fieldValue={'99'}
                handleChange={() => null}
                fieldLabel={'Label'}
            />
        )

        const label = screen.getByText('Label')
        expect(label).toBeTruthy()

        const description = screen.getByText('Description')
        expect(description).toBeTruthy()
    })
})
