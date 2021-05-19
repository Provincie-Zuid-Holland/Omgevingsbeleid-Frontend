import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ButtonAddNewObject from './ButtonAddNewObject'
import { MemoryRouter } from 'react-router-dom'

describe('ButtonAddNewObject', () => {
    it('should render', () => {
        const { queryByText } = render(
            <MemoryRouter>
                <ButtonAddNewObject
                    createNewSlug={'nieuwe-ambitie'}
                    hoofdOnderdeelSlug={'ambities'}
                    titleSingular={'ambitie'}
                />
            </MemoryRouter>
        )
        expect(queryByText('+ Voeg ambitie Toe')).toBeTruthy()
    })
})
