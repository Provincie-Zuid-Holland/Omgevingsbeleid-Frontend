import { render, screen } from '@testing-library/react'
import React from 'react'
import FormFieldRelatieKoppeling from './FormFieldRelatieKoppeling'

describe('FormFieldRelatieKoppeling', () => {
    const defaultProps = {
        titleSingular: 'Singular',
        crudObject: { Titel: 'Titel' },
        connectionProperties: ['belangen', 'taken'],
        disabled: false,
        fieldLabel: 'Label',
        pValue: 'Description',
        dataObjectProperty: 'property',
        placeholderTekst: 'placeholder',
        buttonTekst: 'New connection',
        titelMainObject: 'Titel',
        voegKoppelingRelatieToe: () => null,
        wijzigKoppelingRelatie: () => null,
        verwijderKoppelingRelatie: () => null,
    }

    it('should render', () => {
        const props = { ...defaultProps }
        render(<FormFieldRelatieKoppeling {...props} />)
        expect(screen.getByText('Description')).toBeTruthy()
    })
})
