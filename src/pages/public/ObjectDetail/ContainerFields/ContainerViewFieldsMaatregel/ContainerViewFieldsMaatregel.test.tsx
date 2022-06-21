import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContainerViewFieldsMaatregel from './ContainerViewFieldsMaatregel'

describe('ContainerViewFieldsMaatregel', () => {
    const defaultProps = {
        crudObject: {
            Toelichting: 'Test toelichting',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsMaatregel {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(defaultProps.crudObject.Toelichting)
        expect(element).toBeTruthy()
    })

    it('Component renders nothing when toelichting is empty', () => {
        setup({ crudObject: { Toelichting: '' } })
        const element = screen.queryByText(defaultProps.crudObject.Toelichting)
        expect(element).toBeFalsy()
    })
})
