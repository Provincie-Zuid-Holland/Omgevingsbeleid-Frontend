import { render, screen } from '@testing-library/react'

import { connectionPropertiesType } from '@/constants/koppelingen'

import FormFieldRelatieKoppeling from './FormFieldRelatieKoppeling'

describe('FormFieldRelatieKoppeling', () => {
    const defaultProps = {
        titleSingular: 'Singular',
        crudObject: { Titel: 'Titel' },
        connectionProperties: [
            'belangen',
            'taken',
        ] as connectionPropertiesType[],
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
