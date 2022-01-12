import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import { beleidskeuzeMock } from '../../../mocks/data/crudObjects'
import FormFieldSelectUserGroup from './FormFieldSelectUserGroup'

describe('FormFieldSelectUserGroup', () => {
    const handleChangeMock = jest.fn()
    const defaultProps = {
        disabled: false,
        handleChange: handleChangeMock,
        crudObject: beleidskeuzeMock,
        marginRight: true,
        fieldLabel: 'Personen',
        titleSingular: 'titleSingular',
        editStatus: false,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldSelectUserGroup {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Personen')
        expect(element).toBeTruthy()
    })

    it('Component displays loader when retrieving API data', async () => {
        setup()
        expect(screen.getAllByRole('img')).toBeTruthy()
        expect(screen.getAllByRole('img').length).toBe(5)
        await waitForElementToBeRemoved(() => screen.getAllByRole('img'))
    })
})
