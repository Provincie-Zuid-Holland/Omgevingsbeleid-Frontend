import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ButtonAddNewObject from './ButtonAddNewObject'

describe('ButtonAddNewObject', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <ButtonAddNewObject
                    createNewSlug={'nieuwe-ambitie'}
                    hoofdOnderdeelSlug={'ambities'}
                    titleSingular={'ambitie'}
                />
            </MemoryRouter>
        )
        expect(screen.queryByText('+ Voeg ambitie Toe')).toBeTruthy()
    })
})
