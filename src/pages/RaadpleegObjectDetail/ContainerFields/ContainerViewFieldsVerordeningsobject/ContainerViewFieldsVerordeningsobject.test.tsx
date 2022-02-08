import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContainerViewFieldsVerordeningsobject from './ContainerViewFieldsVerordeningsobject'

describe('ContainerViewFieldsVerordeningsobject', () => {
    const defaultProps = {
        crudObject: {
            Omschrijving: 'Test omschrijving',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsVerordeningsobject {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test omschrijving')
        expect(element).toBeTruthy()
    })

    it('Component renders nothing when omschrijving is empty', () => {
        setup({ crudObject: { Omschrijving: '' } })
        const element = screen.queryByText(defaultProps.crudObject.Omschrijving)
        expect(element).toBeFalsy()
    })
})
