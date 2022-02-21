import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContainerViewFieldsBeleidsregel from './ContainerViewFieldsBeleidsregel'

describe('ContainerViewFieldsBeleidsregel', () => {
    const defaultProps = {
        crudObject: {
            Omschrijving: 'Test omschrijving',
            Externe_URL: 'https://google.com/',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsBeleidsregel {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element =
            screen.getByText(defaultProps.crudObject.Omschrijving) &&
            screen.getByText('Bekijk officiële publicatie')
        expect((screen.getByRole('link') as HTMLLinkElement).href).toBe(
            defaultProps.crudObject.Externe_URL
        )
        expect(element).toBeTruthy()
    })

    it('Component displays no external link when externe url is empty', () => {
        setup({
            crudObject: {
                Omschrijving: defaultProps.crudObject.Omschrijving,
                Externe_URL: '',
            },
        })
        const omschrijvingElement = screen.getByText(
            defaultProps.crudObject.Omschrijving
        )
        const urlElement = screen.queryByText('Bekijk officiële publicatie')
        expect(omschrijvingElement).toBeTruthy()
        expect(urlElement).toBeFalsy()
    })

    it('Component displays no omschrijving when value is empty', () => {
        setup({
            crudObject: {
                Omschrijving: '',
                Externe_URL: defaultProps.crudObject.Externe_URL,
            },
        })
        const omschrijvingElement = screen.queryByText(
            defaultProps.crudObject.Omschrijving
        )
        const urlElement = screen.getByText('Bekijk officiële publicatie')
        expect(omschrijvingElement).toBeFalsy()
        expect(urlElement).toBeTruthy()
    })
})
