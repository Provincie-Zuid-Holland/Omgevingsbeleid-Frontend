import { render, screen } from '@testing-library/react'
import React from 'react'
import FormFieldWerkingsgebied from './FormFieldWerkingsgebied'

describe('FormFieldWerkingsgebied', () => {
    it('should render', () => {
        render(
            <FormFieldWerkingsgebied
                disabled={false}
                setWerkingsgebiedInParentState={() => null}
                werkingsgebiedInParentState={[]}
                titleSingular={'Title'}
                fieldLabel="Selecteer werkingsgebied"
                dataObjectProperty="Werkingsgebieden"
                pValue="Selecteer het werkingsgebied wat bij deze beleidskeuze van toepassing is. Heeft jouw beleidskeuze nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl."
            />
        )
        expect(screen.getByText('Selecteer werkingsgebied')).toBeTruthy()
    })
})
