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
})
