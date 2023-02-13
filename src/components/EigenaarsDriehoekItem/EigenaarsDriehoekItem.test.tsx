import { render, screen } from '@testing-library/react'

import EigenaarsDriehoekItem from './EigenaarsDriehoekItem'

describe('EigenaarsDriehoekItem', () => {
    it('should render', () => {
        render(
            <EigenaarsDriehoekItem
                owner={{
                    Gebruikersnaam: 'Opdrachtgever_test',
                    Rol: '',
                    Status: undefined,
                    UUID: '',
                }}
            />
        )

        const opdrachtgever = screen.getByText('Opdrachtgever_test')
        expect(opdrachtgever).toBeTruthy()
    })
})
