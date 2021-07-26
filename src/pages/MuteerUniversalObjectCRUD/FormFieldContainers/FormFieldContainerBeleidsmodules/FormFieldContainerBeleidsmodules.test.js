import { render, screen } from '@testing-library/react'
import React from 'react'
import FormFieldContainerBeleidsmodules from './FormFieldContainerBeleidsmodules'

describe('FormFieldContainerBeleidsmodules', () => {
    const defaultProps = {
        titleSingular: 'Title Singular',
        crudObject: {},
        handleChange: jest.fn(),
    }

    it('should render', () => {
        render(<FormFieldContainerBeleidsmodules {...defaultProps} />)
        expect(screen.getByText('Algemene informatie')).toBeTruthy()
    })
})
