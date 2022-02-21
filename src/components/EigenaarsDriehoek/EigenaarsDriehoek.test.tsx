import { render, screen } from '@testing-library/react'

import EigenaarsDriehoek from './EigenaarsDriehoek'

describe('EigenaarsDriehoek', () => {
    it('should render', () => {
        render(
            <EigenaarsDriehoek
                dataObject={{
                    Opdrachtgever: { Gebruikersnaam: 'Opdrachtgever_test' },
                    Eigenaar_1: { Gebruikersnaam: 'Eigenaar_1_test' },
                    Eigenaar_2: { Gebruikersnaam: 'Eigenaar_2_test' },
                    Portefeuillehouder_1: {
                        Gebruikersnaam: 'Portefeuillehouder_1_test',
                    },
                    Portefeuillehouder_2: {
                        Gebruikersnaam: 'Portefeuillehouder_2_test',
                    },
                }}
            />
        )

        const opdrachtgever = screen.getByText('Opdrachtgever_test')
        expect(opdrachtgever).toBeTruthy()

        const eigenaar_1 = screen.getByText('Eigenaar_1_test')
        expect(eigenaar_1).toBeTruthy()

        const eigenaar_2 = screen.getByText('Eigenaar_2_test')
        expect(eigenaar_2).toBeTruthy()

        const portefeuillehouder_1 = screen.getByText(
            'Portefeuillehouder_1_test'
        )
        expect(portefeuillehouder_1).toBeTruthy()

        const portefeuillehouder_2 = screen.getByText(
            'Portefeuillehouder_2_test'
        )
        expect(portefeuillehouder_2).toBeTruthy()
    })
})
