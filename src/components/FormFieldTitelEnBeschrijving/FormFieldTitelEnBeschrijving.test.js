import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import FormFieldTitelEnBeschrijving from './FormFieldTitelEnBeschrijving'

describe('FormFieldTextInput', () => {
    const setup = (props = {}) => {
        const { disabled, anchorText, anchorLink, fieldLabel, pValue } = props
        render(
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={'property'}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={'title'}
                anchorText={anchorText ? anchorText : null}
                anchorLink={anchorLink ? anchorLink : null}
                disabled={disabled}
            />
        )
    }

    it('should render the paragraph value', () => {
        setup({ pValue: 'text' })
        const pValue = screen.getByText('text')
        expect(pValue).toBeTruthy()
    })

    it('should not render the paragraph value when none is supplied', () => {
        setup({ pValue: null })
        const pValue = screen.queryByText('text')
        expect(pValue).toBeNull()
    })

    it('should render the label', () => {
        setup({ fieldLabel: 'label' })
        const label = screen.getByText('label')
        expect(label).toBeTruthy()
    })

    it('should not render the label when none is supplied', () => {
        setup({ fieldLabel: null })
        const label = screen.queryByText('label')
        expect(label).toBeNull()
    })

    it('should render a link when supplied as a prop', () => {
        setup({ anchorText: 'anchor', anchorLink: '/anchor' })
        const link = screen.getByText('anchor')
        expect(link).toBeTruthy()
    })

    it('should display a disabled message when element is disabled', () => {
        setup({ disabled: true, pValue: 'text' })
        const disabledText = screen.getByText(
            'text (Kan niet zonder besluitvorming worden gewijzigd)'
        )
        expect(disabledText).toBeTruthy()
    })
})
