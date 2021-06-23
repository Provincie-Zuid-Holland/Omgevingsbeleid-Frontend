import { render, screen } from '@testing-library/react'
import React from 'react'
import ButtonAddNewObject from './ButtonAddNewObject'
import { MemoryRouter } from 'react-router-dom'

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
