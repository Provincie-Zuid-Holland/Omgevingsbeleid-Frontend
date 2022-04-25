import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { QueryClient, QueryClientProvider } from 'react-query'

import { beleidskeuzeMock } from '../../../mocks/data/crudObjects'
import FormFieldSelectUserGroup from './FormFieldSelectUserGroup'

const queryClient = new QueryClient()

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
        render(
            <QueryClientProvider client={queryClient}>
                <Formik
                    initialValues={{}}
                    onSubmit={() => console.log('woehoe')}>
                    <FormFieldSelectUserGroup {...props} />
                </Formik>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Personen')
        expect(element).toBeTruthy()
    })
})
