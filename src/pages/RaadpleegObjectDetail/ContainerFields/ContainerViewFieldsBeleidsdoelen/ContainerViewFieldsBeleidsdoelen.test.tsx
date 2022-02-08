import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ContainerViewFieldsBeleidsdoelen from './ContainerViewFieldsBeleidsdoelen'

describe('ContainerViewFieldsBeleidsdoelen', () => {
    const defaultProps = {
        crudObject: { Omschrijving: 'Test omschrijving' },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<ContainerViewFieldsBeleidsdoelen {...props} />)
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
