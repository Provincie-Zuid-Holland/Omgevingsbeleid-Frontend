import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContainerViewFieldsBeleidskeuze from './ContainerViewFieldsBeleidskeuze'

describe('ContainerViewFieldsBeleidskeuze', () => {
    const defaultProps = {
        crudObject: {
            Omschrijving_Keuze: 'Test omschrijving keuze',
            Afweging: 'Test afweging',
            Aanleiding: 'Test aaanleiding',
            Provinciaal_Belang: 'Test Provinciaal belang',
            Omschrijving_Werking: 'Test omschrijving werking',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsBeleidskeuze {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element =
            screen.getByText(defaultProps.crudObject.Omschrijving_Keuze) &&
            screen.getByText(defaultProps.crudObject.Afweging) &&
            screen.getByText(defaultProps.crudObject.Aanleiding) &&
            screen.getByText(defaultProps.crudObject.Provinciaal_Belang) &&
            screen.getByText(defaultProps.crudObject.Omschrijving_Werking)
        expect(element).toBeTruthy()
    })

    it("Component doesn't display omschrijving keuze when value is empty", () => {
        setup({ crudObject: { Omschrijving_Keuze: '' } })
        const element = screen.queryByText(
            defaultProps.crudObject.Omschrijving_Keuze
        )
        expect(element).toBeFalsy()
    })

    it("Component doesn't display afweging when value is empty", () => {
        setup({ crudObject: { Afweging: '' } })
        const element = screen.queryByText(defaultProps.crudObject.Afweging)
        expect(element).toBeFalsy()
    })

    it("Component doesn't display aanleiding when value is empty", () => {
        setup({ crudObject: { Aanleiding: '' } })
        const element = screen.queryByText(defaultProps.crudObject.Aanleiding)
        expect(element).toBeFalsy()
    })

    it("Component doesn't display Provinciaal belang when value is empty", () => {
        setup({ crudObject: { Provinciaal_Belang: '' } })
        const element = screen.queryByText(
            defaultProps.crudObject.Provinciaal_Belang
        )
        expect(element).toBeFalsy()
    })

    it("Component doesn't display omschrijving werking when value is empty", () => {
        setup({ crudObject: { Omschrijving_Werking: '' } })
        const element = screen.queryByText(
            defaultProps.crudObject.Omschrijving_Werking
        )
        expect(element).toBeFalsy()
    })
})
